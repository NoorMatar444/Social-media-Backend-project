import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConfirmEmailDto,
  ForgetPasswordDto,
  LoginDto,
  ResendConfirmEmailOtp,
  SendForgetPasswordOtpDto,
  SignUpDto,
} from './auth.dto';
import { UserRepo } from '../../Repo/user.repo';
import { HydratedUser } from 'src/models/user.model';
import { TokenService } from '../../common/services/token.service';
import { SecurityServices } from '../../Security/security.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../common/services/Email.services';
import { RedisService } from '../../common/services/Redis/redis.service';
import { ProviderEnum } from 'src/common/enums/user.enum';
import { GoogleProfileUser } from './strategy/google.strategy';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserRepo: UserRepo,
    private readonly TokenService: TokenService,
    private readonly SecurityServices: SecurityServices,
    private readonly ConfigService: ConfigService,
    private readonly EmailService: EmailService,
    private readonly RedisService: RedisService,
    private readonly UserService: UserService,
  ) {}
  async Signup(body: SignUpDto) {
    const { password, phone, email } = body;
    if (await this.UserRepo.findOne({ filter: { email } })) {
      throw new NotFoundException('user already exist');
    }
    await this.UserService.ensureUserNameAvailable(body.userName);
    const hashedPassword = await this.SecurityServices.hashOperation({
      data: password,
      saltOrRounds: Number(this.ConfigService.get<string>('SALT_OR_ROUNDS')),
    });
    const encryptedPhone = phone
      ? this.SecurityServices.encryptPhone({
          phone,
        })
      : undefined;
    const createUser = await this.UserRepo.create({
      data: {
        ...body,
        password: hashedPassword,
        ...(encryptedPhone ? { phone: encryptedPhone } : {}),
      },
    });
    const otp = this.SecurityServices.generateOtp();
    await this.EmailService.sendEmail({
      to: body.email,
      subject: 'confirm email otp',
      text: otp,
    });
    await this.RedisService.setRedisKey({ key: email, value: otp });
    await this.RedisService.expireRedisKey({ key: email, seconds: 4 * 60 });
    return createUser;
  }
  async login(body: LoginDto) {
    const { email, password } = body;
    const userExist = await this.UserRepo.findOne({
      filter: { email, confirmEmail: true },
      projection: '+password',
    });
    if (!userExist) {
      throw new NotFoundException("user doesn't exist");
    }
    if (userExist.provider === ProviderEnum.GOOGLE) {
      throw new BadRequestException('this account uses Google login');
    }
    if (userExist.isActive === false) {
      throw new UnauthorizedException('this account is deactivated');
    }
    const passwordSucceeded = await this.SecurityServices.compareOperation({
      data: password,
      encrypted: userExist.password,
    });
    if (!passwordSucceeded) {
      throw new NotFoundException('please enter the right password');
    }
    if (userExist.phone) {
      this.SecurityServices.decryptPhone({ encryptedPhone: userExist.phone });
    }
    return this.TokenService.generateAccessAndRefreshTokens(
      userExist.role,
      userExist as HydratedUser,
    );
  }
  async confirmEmail(body: ConfirmEmailDto) {
    const { email, otp } = body;
    const storedOtp = await this.RedisService.getRedisKey({ key: email });
    if (!storedOtp) {
      throw new NotFoundException('OTP not found or expired');
    }
    if (storedOtp !== otp) {
      throw new NotFoundException('Invalid OTP');
    }
    const user = await this.UserRepo.findOne({ filter: { email } });
    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }
    await this.UserRepo.findOneAndUpdate({
      filter: { email },
      update: { confirmEmail: true },
    });
    await this.RedisService.deleteRedisKey({ key: email });
    return { message: 'Email confirmed successfully' };
  }
  async resendConfirmEmailOtp(body: ResendConfirmEmailOtp) {
    const { email } = body;
    if (
      !(await this.UserRepo.findOne({ filter: { email, confirmEmail: false } }))
    ) {
      throw new NotFoundException('user does not exist');
    }
    const otp = this.SecurityServices.generateOtp();
    await this.EmailService.sendEmail({
      to: email,
      subject: 'resend confirm email otp',
      text: otp,
    });
    await this.RedisService.setRedisKey({ key: email, value: otp });
    await this.RedisService.expireRedisKey({ key: email, seconds: 4 * 60 });
  }
  async sendForgetPasswordOtp(body: SendForgetPasswordOtpDto) {
    const { email } = body;
    if (
      !(await this.UserRepo.findOne({ filter: { email, confirmEmail: true } }))
    ) {
      throw new NotFoundException('user does not exist');
    }
    const otp = this.SecurityServices.generateOtp();
    await this.EmailService.sendEmail({
      to: email,
      subject: 'forget password otp',
      text: otp,
    });
    await this.RedisService.setRedisKey({ key: email, value: otp });
    await this.RedisService.expireRedisKey({ key: email, seconds: 4 * 60 });
  }
  async forgetPassword(body: ForgetPasswordDto) {
    const { email, otp, password } = body;
    const storedOtp = await this.RedisService.getRedisKey({ key: email });
    if (!storedOtp) {
      throw new NotFoundException('OTP not found or expired');
    }
    if (storedOtp !== otp) {
      throw new NotFoundException('Invalid OTP');
    }
    const user = await this.UserRepo.findOne({ filter: { email } });
    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }
    const hashedPassword = await this.SecurityServices.hashOperation({
      data: password,
      saltOrRounds: Number(this.ConfigService.get<string>('SALT_OR_ROUNDS')),
    });
    await this.UserRepo.findOneAndUpdate({
      filter: { email },
      update: { password: hashedPassword, changeCreditTime: new Date() },
    });
    await this.RedisService.deleteRedisKey({ key: email });
    return { message: 'password updated successfully' };
  }

  async googleAuth(googleUser: GoogleProfileUser) {
    const existingByGoogleId = await this.UserRepo.findOne({
      filter: { googleId: googleUser.googleId },
    });
    if (existingByGoogleId) {
      if (existingByGoogleId.isActive === false) {
        throw new UnauthorizedException('this account is deactivated');
      }
      return this.TokenService.generateAccessAndRefreshTokens(
        existingByGoogleId.role,
        existingByGoogleId as HydratedUser,
      );
    }

    const existingByEmail = await this.UserRepo.findOne({
      filter: { email: googleUser.email },
    });
    if (existingByEmail) {
      if (existingByEmail.provider !== ProviderEnum.GOOGLE) {
        throw new ConflictException(
          'this email is already registered with a password. please login with email and password',
        );
      }
      if (existingByEmail.isActive === false) {
        throw new UnauthorizedException('this account is deactivated');
      }
      return this.TokenService.generateAccessAndRefreshTokens(
        existingByEmail.role,
        existingByEmail as HydratedUser,
      );
    }

    const userName = await this.UserService.uniqueUserName(googleUser.userName);
    const createUser = await this.UserRepo.create({
      data: {
        userName,
        email: googleUser.email,
        googleId: googleUser.googleId,
        provider: ProviderEnum.GOOGLE,
        confirmEmail: true,
        ...(googleUser.profilePicture
          ? { profilePicture: googleUser.profilePicture }
          : {}),
      },
    });
    return this.TokenService.generateAccessAndRefreshTokens(
      createUser.role,
      createUser,
    );
  }

  async logout(tokenPayload: { sub?: string; jti?: string }) {
    const { sub, jti } = tokenPayload;
    if (!sub || !jti) {
      throw new UnauthorizedException('token not valid');
    }
    await this.RedisService.blacklistToken({
      userId: sub,
      tokenId: jti,
    });
    return { message: 'logged out successfully' };
  }
}

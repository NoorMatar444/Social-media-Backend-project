"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_repo_1 = require("../../Repo/user.repo");
const token_service_1 = require("../../common/services/token.service");
const security_service_1 = require("../../Security/security.service");
const config_1 = require("@nestjs/config");
const Email_services_1 = require("../../common/services/Email.services");
const redis_service_1 = require("../../common/services/Redis/redis.service");
const user_enum_1 = require("../../common/enums/user.enum");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    UserRepo;
    TokenService;
    SecurityServices;
    ConfigService;
    EmailService;
    RedisService;
    UserService;
    constructor(UserRepo, TokenService, SecurityServices, ConfigService, EmailService, RedisService, UserService) {
        this.UserRepo = UserRepo;
        this.TokenService = TokenService;
        this.SecurityServices = SecurityServices;
        this.ConfigService = ConfigService;
        this.EmailService = EmailService;
        this.RedisService = RedisService;
        this.UserService = UserService;
    }
    async Signup(body) {
        const { password, phone, email } = body;
        if (await this.UserRepo.findOne({ filter: { email } })) {
            throw new common_1.NotFoundException('user already exist');
        }
        await this.UserService.ensureUserNameAvailable(body.userName);
        const hashedPassword = await this.SecurityServices.hashOperation({
            data: password,
            saltOrRounds: Number(this.ConfigService.get('SALT_OR_ROUNDS')),
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
    async login(body) {
        const { email, password } = body;
        const userExist = await this.UserRepo.findOne({
            filter: { email, confirmEmail: true },
            projection: '+password',
        });
        if (!userExist) {
            throw new common_1.NotFoundException("user doesn't exist");
        }
        if (userExist.provider === user_enum_1.ProviderEnum.GOOGLE) {
            throw new common_1.BadRequestException('this account uses Google login');
        }
        if (userExist.isActive === false) {
            throw new common_1.UnauthorizedException('this account is deactivated');
        }
        const passwordSucceeded = await this.SecurityServices.compareOperation({
            data: password,
            encrypted: userExist.password,
        });
        if (!passwordSucceeded) {
            throw new common_1.NotFoundException('please enter the right password');
        }
        if (userExist.phone) {
            this.SecurityServices.decryptPhone({ encryptedPhone: userExist.phone });
        }
        return this.TokenService.generateAccessAndRefreshTokens(userExist.role, userExist);
    }
    async confirmEmail(body) {
        const { email, otp } = body;
        const storedOtp = await this.RedisService.getRedisKey({ key: email });
        if (!storedOtp) {
            throw new common_1.NotFoundException('OTP not found or expired');
        }
        if (storedOtp !== otp) {
            throw new common_1.NotFoundException('Invalid OTP');
        }
        const user = await this.UserRepo.findOne({ filter: { email } });
        if (!user) {
            throw new common_1.NotFoundException("user doesn't exist");
        }
        await this.UserRepo.findOneAndUpdate({
            filter: { email },
            update: { confirmEmail: true },
        });
        await this.RedisService.deleteRedisKey({ key: email });
        return { message: 'Email confirmed successfully' };
    }
    async resendConfirmEmailOtp(body) {
        const { email } = body;
        if (!(await this.UserRepo.findOne({ filter: { email, confirmEmail: false } }))) {
            throw new common_1.NotFoundException('user does not exist');
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
    async sendForgetPasswordOtp(body) {
        const { email } = body;
        if (!(await this.UserRepo.findOne({ filter: { email, confirmEmail: true } }))) {
            throw new common_1.NotFoundException('user does not exist');
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
    async forgetPassword(body) {
        const { email, otp, password } = body;
        const storedOtp = await this.RedisService.getRedisKey({ key: email });
        if (!storedOtp) {
            throw new common_1.NotFoundException('OTP not found or expired');
        }
        if (storedOtp !== otp) {
            throw new common_1.NotFoundException('Invalid OTP');
        }
        const user = await this.UserRepo.findOne({ filter: { email } });
        if (!user) {
            throw new common_1.NotFoundException("user doesn't exist");
        }
        const hashedPassword = await this.SecurityServices.hashOperation({
            data: password,
            saltOrRounds: Number(this.ConfigService.get('SALT_OR_ROUNDS')),
        });
        await this.UserRepo.findOneAndUpdate({
            filter: { email },
            update: { password: hashedPassword, changeCreditTime: new Date() },
        });
        await this.RedisService.deleteRedisKey({ key: email });
        return { message: 'password updated successfully' };
    }
    async googleAuth(googleUser) {
        const existingByGoogleId = await this.UserRepo.findOne({
            filter: { googleId: googleUser.googleId },
        });
        if (existingByGoogleId) {
            if (existingByGoogleId.isActive === false) {
                throw new common_1.UnauthorizedException('this account is deactivated');
            }
            return this.TokenService.generateAccessAndRefreshTokens(existingByGoogleId.role, existingByGoogleId);
        }
        const existingByEmail = await this.UserRepo.findOne({
            filter: { email: googleUser.email },
        });
        if (existingByEmail) {
            if (existingByEmail.provider !== user_enum_1.ProviderEnum.GOOGLE) {
                throw new common_1.ConflictException('this email is already registered with a password. please login with email and password');
            }
            if (existingByEmail.isActive === false) {
                throw new common_1.UnauthorizedException('this account is deactivated');
            }
            return this.TokenService.generateAccessAndRefreshTokens(existingByEmail.role, existingByEmail);
        }
        const userName = await this.UserService.uniqueUserName(googleUser.userName);
        const createUser = await this.UserRepo.create({
            data: {
                userName,
                email: googleUser.email,
                googleId: googleUser.googleId,
                provider: user_enum_1.ProviderEnum.GOOGLE,
                confirmEmail: true,
                ...(googleUser.profilePicture
                    ? { profilePicture: googleUser.profilePicture }
                    : {}),
            },
        });
        return this.TokenService.generateAccessAndRefreshTokens(createUser.role, createUser);
    }
    async logout(tokenPayload) {
        const { sub, jti } = tokenPayload;
        if (!sub || !jti) {
            throw new common_1.UnauthorizedException('token not valid');
        }
        await this.TokenService.blacklistToken({
            userId: sub,
            tokenId: jti,
        });
        return { message: 'logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_1.UserRepo,
        token_service_1.TokenService,
        security_service_1.SecurityServices,
        config_1.ConfigService,
        Email_services_1.EmailService,
        redis_service_1.RedisService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
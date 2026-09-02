import { ConfirmEmailDto, ForgetPasswordDto, LoginDto, ResendConfirmEmailOtp, SendForgetPasswordOtpDto, SignUpDto } from './auth.dto';
import { UserRepo } from '../../Repo/user.repo';
import { TokenService } from '../../common/services/token.service';
import { SecurityServices } from '../../Security/security.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../common/services/Email.services';
import { RedisService } from '../../common/services/Redis/redis.service';
import { GoogleProfileUser } from './strategy/google.strategy';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly UserRepo;
    private readonly TokenService;
    private readonly SecurityServices;
    private readonly ConfigService;
    private readonly EmailService;
    private readonly RedisService;
    private readonly UserService;
    constructor(UserRepo: UserRepo, TokenService: TokenService, SecurityServices: SecurityServices, ConfigService: ConfigService, EmailService: EmailService, RedisService: RedisService, UserService: UserService);
    Signup(body: SignUpDto): Promise<import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    login(body: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    confirmEmail(body: ConfirmEmailDto): Promise<{
        message: string;
    }>;
    resendConfirmEmailOtp(body: ResendConfirmEmailOtp): Promise<void>;
    sendForgetPasswordOtp(body: SendForgetPasswordOtpDto): Promise<void>;
    forgetPassword(body: ForgetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(googleUser: GoogleProfileUser): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(tokenPayload: {
        sub?: string;
        jti?: string;
    }): Promise<{
        message: string;
    }>;
}

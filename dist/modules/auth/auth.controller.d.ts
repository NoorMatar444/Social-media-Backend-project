import { ConfirmEmailDto, ForgetPasswordDto, LoginDto, ResendConfirmEmailOtp, SendForgetPasswordOtpDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GoogleProfileUser } from './strategy/google.strategy';
import type { IAuthRequest } from "../../common/interfaces/request.interface";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(): void;
    googleAuthCallback(req: {
        user: GoogleProfileUser;
    }): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    SignUp(body: SignUpDto): Promise<import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    Login(body: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    ConfirmEmail(body: ConfirmEmailDto): Promise<{
        message: string;
    }>;
    ResendConfirmEmailOtp(body: ResendConfirmEmailOtp): Promise<void>;
    SendForgetPasswordOtp(body: SendForgetPasswordOtpDto): Promise<void>;
    ForgetPassword(body: ForgetPasswordDto): Promise<{
        message: string;
    }>;
    Logout(req: IAuthRequest): Promise<{
        message: string;
    }>;
}

import { GenderEnum } from "../../common/enums/user.enum";
export declare class SignUpDto {
    userName: string;
    email: string;
    password: string;
    gender?: GenderEnum;
    phone?: string;
    DOB?: Date;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ConfirmEmailDto {
    email: string;
    otp: string;
}
export declare class ResendConfirmEmailOtp {
    email: string;
}
export declare class SendForgetPasswordOtpDto {
    email: string;
}
export declare class ForgetPasswordDto {
    email: string;
    otp: string;
    password: string;
}

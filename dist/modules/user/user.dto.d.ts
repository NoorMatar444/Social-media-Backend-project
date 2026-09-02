import { GenderEnum } from "../../common/enums/user.enum";
export declare class UpdateProfileDto {
    userName?: string;
    gender?: GenderEnum;
    DOB?: Date;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class UpdatePhoneDto {
    phone: string;
}
export declare class RemoveCoverPictureDto {
    pictureKey: string[];
}
export declare class DeleteAccountDto {
    password?: string;
}

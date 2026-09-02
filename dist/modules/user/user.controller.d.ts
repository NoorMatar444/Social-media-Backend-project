import type { HydratedUser } from "../../models/user.model";
import { ChangePasswordDto, DeleteAccountDto, RemoveCoverPictureDto, UpdatePhoneDto, UpdateProfileDto } from './user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    GetMyProfile(user: HydratedUser): Promise<import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    UpdateProfile(user: HydratedUser, body: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    UpdatePhone(user: HydratedUser, body: UpdatePhoneDto): Promise<import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    ChangePassword(user: HydratedUser, body: ChangePasswordDto): Promise<(import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    UploadProfilePicture(user: HydratedUser, file: Express.Multer.File): Promise<(import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    RemoveProfilePicture(user: HydratedUser): Promise<string>;
    UploadCoverPictures(user: HydratedUser, files: Express.Multer.File[]): Promise<(import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    RemoveCoverPicture(user: HydratedUser, body: RemoveCoverPictureDto): Promise<string>;
    DeactivateAccount(user: HydratedUser): Promise<{
        message: string;
    }>;
    DeleteAccount(user: HydratedUser, body?: DeleteAccountDto): Promise<{
        message: string;
    }>;
    GetPublicProfile(id: string): Promise<import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    GetUserByUserName(userName: string): Promise<import("src/models/user.model").User>;
}

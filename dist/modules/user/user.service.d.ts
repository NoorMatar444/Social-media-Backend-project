import { UserRepo } from '../../Repo/user.repo';
import { ChangePasswordDto, UpdateProfileDto } from './user.dto';
import { SecurityServices } from '../../Security/security.service';
import { S3BucketService } from '../../common/services/s3Bucket.service';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private readonly UserRepo;
    private readonly SecurityServices;
    private readonly S3BucketService;
    private readonly ConfigService;
    constructor(UserRepo: UserRepo, SecurityServices: SecurityServices, S3BucketService: S3BucketService, ConfigService: ConfigService);
    getMyProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPublicProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getUserByUserName(userName: string): Promise<import("../../models/user.model").User>;
    getUserById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProfile(userId: string, body: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updatePhone(userId: string, phone: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    changePassword(userId: string, body: ChangePasswordDto): Promise<(import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<(import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    uploadCoverPictures(userId: string, files: Express.Multer.File[]): Promise<(import("mongoose").Document<unknown, {}, import("../../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/user.model").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeProfilePicture(userId: string): Promise<string>;
    removeCoverPicture(userId: string, pictureKey: string[]): Promise<string>;
    deleteAccount(userId: string, password?: string): Promise<{
        message: string;
    }>;
    deactivateAccount(userId: string): Promise<{
        message: string;
    }>;
    ensureUserNameAvailable(userName: string, excludeUserId?: string): Promise<void>;
    private toUserName;
    uniqueUserName(raw: string): Promise<string>;
}

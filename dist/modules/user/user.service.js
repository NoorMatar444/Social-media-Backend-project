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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repo_1 = require("../../Repo/user.repo");
const security_service_1 = require("../../Security/security.service");
const s3Bucket_service_1 = require("../../common/services/s3Bucket.service");
const multer_enum_1 = require("../../common/enums/multer.enum");
const user_enum_1 = require("../../common/enums/user.enum");
const config_1 = require("@nestjs/config");
const PUBLIC_PROFILE_PROJECTION = 'userName profilePicture coverPicture gender';
let UserService = class UserService {
    UserRepo;
    SecurityServices;
    S3BucketService;
    ConfigService;
    constructor(UserRepo, SecurityServices, S3BucketService, ConfigService) {
        this.UserRepo = UserRepo;
        this.SecurityServices = SecurityServices;
        this.S3BucketService = S3BucketService;
        this.ConfigService = ConfigService;
    }
    async getMyProfile(userId) {
        const user = await this.UserRepo.findById({
            id: userId,
            projection: '-password',
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (user.phone) {
            user.phone = this.SecurityServices.decryptPhone({
                encryptedPhone: user.phone,
            });
        }
        return user;
    }
    async getPublicProfile(userId) {
        const user = await this.UserRepo.findById({
            id: userId,
            projection: PUBLIC_PROFILE_PROJECTION,
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        return user;
    }
    async getUserByUserName(userName) {
        const user = await this.UserRepo.findOne({
            filter: { userName },
            projection: PUBLIC_PROFILE_PROJECTION,
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        return user;
    }
    async getUserById(id) {
        const user = await this.UserRepo.findById({
            id,
            projection: PUBLIC_PROFILE_PROJECTION,
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        return user;
    }
    async updateProfile(userId, body) {
        if (body.userName) {
            await this.ensureUserNameAvailable(body.userName, userId);
        }
        const user = await this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { ...body },
            options: { new: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        return user;
    }
    async updatePhone(userId, phone) {
        const encryptedPhone = this.SecurityServices.encryptPhone({ phone });
        const user = await this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { phone: encryptedPhone },
            options: { new: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        return user;
    }
    async changePassword(userId, body) {
        const user = await this.UserRepo.findById({
            id: userId,
            projection: '+password',
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (user.provider === user_enum_1.ProviderEnum.GOOGLE) {
            throw new common_1.BadRequestException('this account uses Google login');
        }
        if (!(await this.SecurityServices.compareOperation({
            data: body.oldPassword,
            encrypted: user.password,
        }))) {
            throw new common_1.BadRequestException('password does not match');
        }
        const hashedPassword = await this.SecurityServices.hashOperation({
            data: body.newPassword,
            saltOrRounds: Number(this.ConfigService.get('SALT_OR_ROUNDS')),
        });
        return this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { password: hashedPassword, changeCreditTime: new Date() },
            options: { new: true },
        });
    }
    async uploadProfilePicture(userId, file) {
        const user = await this.UserRepo.findById({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (!file) {
            throw new common_1.BadRequestException('file is required');
        }
        if (user.profilePicture && !user.profilePicture.startsWith('http')) {
            await this.S3BucketService.deleteFile(user.profilePicture);
        }
        const key = await this.S3BucketService.uploadFile({
            file,
            path: '/user',
        });
        return this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { profilePicture: key },
            options: { new: true },
        });
    }
    async uploadCoverPictures(userId, files) {
        const user = await this.UserRepo.findById({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (!files?.length) {
            throw new common_1.BadRequestException('files are required');
        }
        const keys = (await this.S3BucketService.uploadFiles({
            files,
            path: '/user',
            storageApproach: multer_enum_1.StorageApproachEnum.MEMORY,
        })).filter((key) => Boolean(key));
        return this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { $push: { coverPicture: { $each: keys } } },
            options: { new: true },
        });
    }
    async removeProfilePicture(userId) {
        const user = await this.UserRepo.findById({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (user.profilePicture && !user.profilePicture.startsWith('http')) {
            await this.S3BucketService.deleteFile(user.profilePicture);
        }
        await this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { profilePicture: '' },
        });
        return 'profilePicture deleted successfully';
    }
    async removeCoverPicture(userId, pictureKey) {
        const user = await this.UserRepo.findById({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (!pictureKey?.length) {
            throw new common_1.BadRequestException('picture keys are required');
        }
        const ownedKeys = pictureKey.filter((key) => user.coverPicture?.includes(key));
        if (!ownedKeys.length) {
            throw new common_1.BadRequestException('cover picture does not belong to user');
        }
        await this.S3BucketService.deleteFiles(ownedKeys);
        await this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { $pull: { coverPicture: { $in: ownedKeys } } },
        });
        return 'CoverPicture deleted successfully';
    }
    async deleteAccount(userId, password) {
        const user = await this.UserRepo.findById({
            id: userId,
            projection: '+password',
        });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (user.provider === user_enum_1.ProviderEnum.SYSTEM) {
            if (!password) {
                throw new common_1.BadRequestException('password is required');
            }
            if (!(await this.SecurityServices.compareOperation({
                data: password,
                encrypted: user.password,
            }))) {
                throw new common_1.BadRequestException('password does not match');
            }
        }
        await this.UserRepo.findByIdAndDelete({ id: userId });
        if (user.profilePicture && !user.profilePicture.startsWith('http')) {
            await this.S3BucketService.deleteFile(user.profilePicture);
        }
        const coverKeys = (user.coverPicture || []).filter((key) => key && !key.startsWith('http'));
        if (coverKeys.length) {
            await this.S3BucketService.deleteFiles(coverKeys);
        }
        return { message: 'account deleted successfully' };
    }
    async deactivateAccount(userId) {
        const user = await this.UserRepo.findById({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('user does not exist');
        }
        await this.UserRepo.findOneAndUpdate({
            filter: { _id: userId },
            update: { isActive: false, changeCreditTime: new Date() },
        });
        return { message: 'account deactivated successfully' };
    }
    async ensureUserNameAvailable(userName, excludeUserId) {
        const existing = await this.UserRepo.findOne({
            filter: excludeUserId
                ? { userName, _id: { $ne: excludeUserId } }
                : { userName },
        });
        if (existing) {
            throw new common_1.ConflictException('userName is already taken');
        }
    }
    toUserName(raw) {
        const cleaned = raw
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^\p{L}\p{N}_]/gu, '')
            .slice(0, 30);
        return cleaned.length >= 3
            ? cleaned
            : `user_${Date.now().toString().slice(-6)}`;
    }
    async uniqueUserName(raw) {
        const base = this.toUserName(raw);
        let candidate = base;
        let i = 0;
        while (await this.UserRepo.findOne({ filter: { userName: candidate } })) {
            i += 1;
            const suffix = `_${i}`;
            candidate = `${base.slice(0, Math.max(3, 30 - suffix.length))}${suffix}`;
            if (i > 50) {
                candidate = `user_${Date.now()}`;
                break;
            }
        }
        return candidate;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_1.UserRepo,
        security_service_1.SecurityServices,
        s3Bucket_service_1.S3BucketService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map
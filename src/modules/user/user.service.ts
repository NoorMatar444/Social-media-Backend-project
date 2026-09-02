import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepo } from '../../Repo/user.repo';
import { ChangePasswordDto, UpdateProfileDto } from './user.dto';
import { SecurityServices } from '../../Security/security.service';
import { S3BucketService } from '../../common/services/s3Bucket.service';
import { StorageApproachEnum } from 'src/common/enums/multer.enum';
import { ProviderEnum } from 'src/common/enums/user.enum';
import { ConfigService } from '@nestjs/config';

const PUBLIC_PROFILE_PROJECTION = 'userName profilePicture coverPicture gender';

@Injectable()
export class UserService {
  constructor(
    private readonly UserRepo: UserRepo,
    private readonly SecurityServices: SecurityServices,
    private readonly S3BucketService: S3BucketService,
    private readonly ConfigService: ConfigService,
  ) {}
  async getMyProfile(userId: string) {
    const user = await this.UserRepo.findById({
      id: userId,
      projection: '-password',
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    if (user.phone) {
      user.phone = this.SecurityServices.decryptPhone({
        encryptedPhone: user.phone,
      });
    }
    return user;
  }
  async getPublicProfile(userId: string) {
    const user = await this.UserRepo.findById({
      id: userId,
      projection: PUBLIC_PROFILE_PROJECTION,
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return user;
  }
  async getUserByUserName(userName: string) {
    const user = await this.UserRepo.findOne({
      filter: { userName },
      projection: PUBLIC_PROFILE_PROJECTION,
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return user;
  }
  async getUserById(id: string) {
    const user = await this.UserRepo.findById({
      id,
      projection: PUBLIC_PROFILE_PROJECTION,
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return user;
  }
  async updateProfile(userId: string, body: UpdateProfileDto) {
    if (body.userName) {
      await this.ensureUserNameAvailable(body.userName, userId);
    }
    const user = await this.UserRepo.findOneAndUpdate({
      filter: { _id: userId },
      update: { ...body },
      options: { new: true },
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return user;
  }
  async updatePhone(userId: string, phone: string) {
    const encryptedPhone = this.SecurityServices.encryptPhone({ phone });
    const user = await this.UserRepo.findOneAndUpdate({
      filter: { _id: userId },
      update: { phone: encryptedPhone },
      options: { new: true },
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    return user;
  }
  async changePassword(userId: string, body: ChangePasswordDto) {
    const user = await this.UserRepo.findById({
      id: userId,
      projection: '+password',
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    if (user.provider === ProviderEnum.GOOGLE) {
      throw new BadRequestException('this account uses Google login');
    }
    if (
      !(await this.SecurityServices.compareOperation({
        data: body.oldPassword,
        encrypted: user.password,
      }))
    ) {
      throw new BadRequestException('password does not match');
    }
    const hashedPassword = await this.SecurityServices.hashOperation({
      data: body.newPassword,
      saltOrRounds: Number(this.ConfigService.get<string>('SALT_OR_ROUNDS')),
    });
    return this.UserRepo.findOneAndUpdate({
      filter: { _id: userId },
      update: { password: hashedPassword, changeCreditTime: new Date() },
      options: { new: true },
    });
  }
  async uploadProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await this.UserRepo.findById({ id: userId });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    if (!file) {
      throw new BadRequestException('file is required');
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

  async uploadCoverPictures(userId: string, files: Express.Multer.File[]) {
    const user = await this.UserRepo.findById({ id: userId });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    if (!files?.length) {
      throw new BadRequestException('files are required');
    }
    const keys = (
      await this.S3BucketService.uploadFiles({
        files,
        path: '/user',
        storageApproach: StorageApproachEnum.MEMORY,
      })
    ).filter((key): key is string => Boolean(key));
    return this.UserRepo.findOneAndUpdate({
      filter: { _id: userId },
      update: { $push: { coverPicture: { $each: keys } } },
      options: { new: true },
    });
  }
  async removeProfilePicture(userId: string) {
    const user = await this.UserRepo.findById({ id: userId });
    if (!user) {
      throw new NotFoundException('user does not exist');
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
  async removeCoverPicture(userId: string, pictureKey: string[]) {
    const user = await this.UserRepo.findById({ id: userId });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    if (!pictureKey?.length) {
      throw new BadRequestException('picture keys are required');
    }
    const ownedKeys = pictureKey.filter((key) =>
      user.coverPicture?.includes(key),
    );
    if (!ownedKeys.length) {
      throw new BadRequestException('cover picture does not belong to user');
    }
    await this.S3BucketService.deleteFiles(ownedKeys);
    await this.UserRepo.findOneAndUpdate({
      filter: { _id: userId },
      update: { $pull: { coverPicture: { $in: ownedKeys } } },
    });
    return 'CoverPicture deleted successfully';
  }
  async deleteAccount(userId: string, password?: string) {
    const user = await this.UserRepo.findById({
      id: userId,
      projection: '+password',
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    if (user.provider === ProviderEnum.SYSTEM) {
      if (!password) {
        throw new BadRequestException('password is required');
      }
      if (
        !(await this.SecurityServices.compareOperation({
          data: password,
          encrypted: user.password,
        }))
      ) {
        throw new BadRequestException('password does not match');
      }
    }
    await this.UserRepo.findByIdAndDelete({ id: userId });
    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
      await this.S3BucketService.deleteFile(user.profilePicture);
    }
    const coverKeys = (user.coverPicture || []).filter(
      (key) => key && !key.startsWith('http'),
    );
    if (coverKeys.length) {
      await this.S3BucketService.deleteFiles(coverKeys);
    }
    return { message: 'account deleted successfully' };
  }

  async deactivateAccount(userId: string) {
    const user = await this.UserRepo.findById({ id: userId });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    await this.UserRepo.findOneAndUpdate({
      filter: { _id: userId },
      update: { isActive: false, changeCreditTime: new Date() },
    });

    return { message: 'account deactivated successfully' };
  }
  async ensureUserNameAvailable(userName: string, excludeUserId?: string) {
    const existing = await this.UserRepo.findOne({
      filter: excludeUserId
        ? { userName, _id: { $ne: excludeUserId } }
        : { userName },
    });
    if (existing) {
      throw new ConflictException('userName is already taken');
    }
  }

  private toUserName(raw: string): string {
    const cleaned = raw
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\p{L}\p{N}_]/gu, '')
      .slice(0, 30);
    return cleaned.length >= 3
      ? cleaned
      : `user_${Date.now().toString().slice(-6)}`;
  }

  async uniqueUserName(raw: string): Promise<string> {
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
}

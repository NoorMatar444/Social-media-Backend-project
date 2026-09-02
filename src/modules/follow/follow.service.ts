import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowRepo } from 'src/Repo/follow.repo';
import { UserRepo } from 'src/Repo/user.repo';

@Injectable()
export class FollowService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly followRepo: FollowRepo,
  ) {}
  async followUser(followerId: string, followingId: string) {
    if (followerId.toString() == followingId.toString()) {
      throw new BadRequestException('you can not follow yourself');
    }
    const followerUser = await this.userRepo.findById({ id: followerId });
    const followingUser = await this.userRepo.findById({ id: followingId });
    if (!followerUser || !followingUser) {
      throw new NotFoundException('user does not exist');
    }
    if (followerUser.isActive == false || followingUser.isActive == false) {
      throw new NotFoundException('user does not exist');
    }
    const existingFollow = await this.followRepo.findOne({
      filter: { followerId, followingId },
    });
    if (existingFollow) {
      throw new ConflictException('already following this user');
    }
    const createFollow = await this.followRepo.create({
      data: {
        followerId,
        followingId,
      },
    });
    return createFollow;
  }
  async unfollowUser(followerId: string, followingId: string) {
    if (followerId.toString() == followingId.toString()) {
      throw new BadRequestException('you can not follow yourself');
    }
    const followerUser = await this.userRepo.findById({ id: followerId });
    const followingUser = await this.userRepo.findById({ id: followingId });
    if (!followerUser || !followingUser) {
      throw new NotFoundException('user does not exist');
    }
    const deletedUser = await this.followRepo.findOneAndDelete({
      filter: { followerId, followingId },
    });
    if (!deletedUser) {
      throw new NotFoundException('you are not following this user');
    }
    return 'unfollowed successfully';
  }
  async getFollowers(userId: string, page: number, limit: number) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const followers = await this.followRepo.findAll({
      filter: { followingId: userId },
      options: {
        skip: (page - 1) * limit,
        limit,
        sort: { createdAt: -1 },
        populate: [{ path: 'followerId', select: 'userName profilePicture' }],
      },
    });
    return followers;
  }
  async getFollowing(userId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const followers = await this.followRepo.findAll({
      filter: { followerId: userId },
      options: {
        sort: { createdAt: -1 },
        populate: [{ path: 'followingId', select: 'userName profilePicture' }],
      },
    });
    return followers;
  }
  async getFollowCounts(userId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const followerCount = await this.followRepo.countDocument({
      filter: { followingId: userId },
    });
    const followingCount = await this.followRepo.countDocument({
      filter: { followerId: userId },
    });
    return { followerCount, followingCount };
  }
  async isFollowing(followerId: string, followingId: string) {
    if (followerId.toString() == followingId.toString()) {
      return { following: false };
    }
    const follow = await this.followRepo.findOne({
      filter: { followerId, followingId },
    });
    return { following: Boolean(follow) };
  }
  async getFollowingIds(userId: string) {
    const follows = await this.followRepo.findAll({
      filter: { followerId: userId },
      projection: 'followingId',
    });
    return follows.map((follow) => follow.followingId);
  }
}

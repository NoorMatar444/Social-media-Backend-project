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
exports.FollowService = void 0;
const common_1 = require("@nestjs/common");
const follow_repo_1 = require("../../Repo/follow.repo");
const user_repo_1 = require("../../Repo/user.repo");
let FollowService = class FollowService {
    userRepo;
    followRepo;
    constructor(userRepo, followRepo) {
        this.userRepo = userRepo;
        this.followRepo = followRepo;
    }
    async followUser(followerId, followingId) {
        if (followerId.toString() == followingId.toString()) {
            throw new common_1.BadRequestException('you can not follow yourself');
        }
        const followerUser = await this.userRepo.findById({ id: followerId });
        const followingUser = await this.userRepo.findById({ id: followingId });
        if (!followerUser || !followingUser) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (followerUser.isActive == false || followingUser.isActive == false) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const existingFollow = await this.followRepo.findOne({
            filter: { followerId, followingId },
        });
        if (existingFollow) {
            throw new common_1.ConflictException('already following this user');
        }
        const createFollow = await this.followRepo.create({
            data: {
                followerId,
                followingId,
            },
        });
        return createFollow;
    }
    async unfollowUser(followerId, followingId) {
        if (followerId.toString() == followingId.toString()) {
            throw new common_1.BadRequestException('you can not follow yourself');
        }
        const followerUser = await this.userRepo.findById({ id: followerId });
        const followingUser = await this.userRepo.findById({ id: followingId });
        if (!followerUser || !followingUser) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const deletedUser = await this.followRepo.findOneAndDelete({
            filter: { followerId, followingId },
        });
        if (!deletedUser) {
            throw new common_1.NotFoundException('you are not following this user');
        }
        return 'unfollowed successfully';
    }
    async getFollowers(userId, page, limit) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
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
    async getFollowing(userId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
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
    async getFollowCounts(userId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const followerCount = await this.followRepo.countDocument({
            filter: { followingId: userId },
        });
        const followingCount = await this.followRepo.countDocument({
            filter: { followerId: userId },
        });
        return { followerCount, followingCount };
    }
    async isFollowing(followerId, followingId) {
        if (followerId.toString() == followingId.toString()) {
            return { following: false };
        }
        const follow = await this.followRepo.findOne({
            filter: { followerId, followingId },
        });
        return { following: Boolean(follow) };
    }
    async getFollowingIds(userId) {
        const follows = await this.followRepo.findAll({
            filter: { followerId: userId },
            projection: 'followingId',
        });
        return follows.map((follow) => follow.followingId);
    }
};
exports.FollowService = FollowService;
exports.FollowService = FollowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_1.UserRepo,
        follow_repo_1.FollowRepo])
], FollowService);
//# sourceMappingURL=follow.service.js.map
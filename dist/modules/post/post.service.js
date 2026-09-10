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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const post_repo_1 = require("../../Repo/post.repo");
const user_repo_1 = require("../../Repo/user.repo");
const post_enum_1 = require("../../common/enums/post.enum");
const s3Bucket_service_1 = require("../../common/services/s3Bucket.service");
const multer_enum_1 = require("../../common/enums/multer.enum");
const follow_service_1 = require("../follow/follow.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("mongoose");
const post_liked_event_1 = require("../../common/events/post-liked.event");
const user_mentioned_event_1 = require("../../common/events/user-mentioned.event");
let PostService = class PostService {
    postRepo;
    userRepo;
    S3BucketService;
    followService;
    eventEmitter;
    constructor(postRepo, userRepo, S3BucketService, followService, eventEmitter) {
        this.postRepo = postRepo;
        this.userRepo = userRepo;
        this.S3BucketService = S3BucketService;
        this.followService = followService;
        this.eventEmitter = eventEmitter;
    }
    async assertCanViewPost(post, viewerId) {
        const isOwner = post.createdBy.toString() === viewerId.toString();
        if (isOwner) {
            return;
        }
        if (post.privacy === post_enum_1.PrivacyEnum.PUBLIC) {
            return;
        }
        if (post.privacy === post_enum_1.PrivacyEnum.FRIENDS) {
            const { following } = await this.followService.isFollowing(viewerId, post.createdBy.toString());
            if (following) {
                return;
            }
        }
        throw new common_1.ForbiddenException('you can not view this post');
    }
    async createPost(body, user, files) {
        const hasContent = typeof body.content === 'string' && body.content.trim().length > 0;
        if (!hasContent && !files?.length) {
            throw new common_1.BadRequestException('Post must have content or at least one attachment');
        }
        const uniqueTags = [...new Set(body.tags ?? [])];
        if (uniqueTags.length) {
            const taggedUsers = await this.userRepo.findAll({
                filter: { _id: { $in: uniqueTags } },
            });
            if (taggedUsers.length !== uniqueTags.length) {
                throw new common_1.BadRequestException('one or more tagged users do not exist');
            }
        }
        const keys = files?.length
            ? (await this.S3BucketService.uploadFiles({
                files,
                path: '/post',
                storageApproach: multer_enum_1.StorageApproachEnum.MEMORY,
            })).filter((key) => Boolean(key))
            : [];
        const post = await this.postRepo.create({
            data: {
                ...body,
                tags: uniqueTags,
                createdBy: user._id,
                attachments: keys,
            },
        });
        for (const tagId of uniqueTags) {
            if (tagId.toString() === user._id.toString()) {
                continue;
            }
            this.eventEmitter.emit('user.mentioned', new user_mentioned_event_1.UserMentionedEvent(user._id, post._id, new mongoose_1.Types.ObjectId(tagId)));
        }
        return post;
    }
    async getPost(postId, userId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const post = await this.postRepo.findOne({
            filter: { _id: postId, deletedAt: null },
            projection: '-deletedAt',
            options: {
                populate: [
                    {
                        path: 'tags',
                    },
                ],
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        await this.assertCanViewPost(post, userId);
        return post;
    }
    async getUserPosts(userId, viewerId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const isOwner = userId === viewerId;
        const { following } = await this.followService.isFollowing(viewerId, userId);
        const posts = await this.postRepo.findAll({
            filter: isOwner
                ? { createdBy: userId, deletedAt: null }
                : following
                    ? {
                        createdBy: userId,
                        deletedAt: null,
                        privacy: { $in: [post_enum_1.PrivacyEnum.PUBLIC, post_enum_1.PrivacyEnum.FRIENDS] },
                    }
                    : { createdBy: userId, deletedAt: null, privacy: post_enum_1.PrivacyEnum.PUBLIC },
        });
        return posts;
    }
    async updatePost(body, userId, postId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const updatedPost = await this.postRepo.findOneAndUpdate({
            filter: { _id: postId, createdBy: userId, deletedAt: null },
            update: { ...body },
            options: { new: true },
        });
        if (!updatedPost) {
            throw new common_1.NotFoundException('post does not exist');
        }
        return updatedPost;
    }
    async deletePost(postID, userId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const post = await this.postRepo.findOneAndUpdate({
            filter: { _id: postID, createdBy: userId, deletedAt: null },
            update: { deletedAt: new Date() },
            options: { new: true },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        return post;
    }
    async likePost(userId, postId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const post = await this.postRepo.findOne({
            filter: { _id: postId, deletedAt: null },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        await this.assertCanViewPost(post, userId);
        const alreadyLiked = post.likes.some((likeId) => likeId.toString() === userId.toString());
        const likes = await this.postRepo.findOneAndUpdate({
            filter: { _id: postId, deletedAt: null },
            update: { $addToSet: { likes: userId } },
            options: { new: true },
        });
        if (!likes) {
            throw new common_1.NotFoundException('post does not exist');
        }
        if (!alreadyLiked && post.createdBy.toString() !== userId.toString()) {
            this.eventEmitter.emit('post.liked', new post_liked_event_1.PostLikedEvent(new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(postId), post.createdBy));
        }
        return likes;
    }
    async unlikePost(userId, postId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const post = await this.postRepo.findOne({
            filter: { _id: postId, deletedAt: null },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        await this.assertCanViewPost(post, userId);
        const unlikePost = await this.postRepo.findOneAndUpdate({
            filter: { _id: postId, deletedAt: null },
            update: { $pull: { likes: userId } },
            options: { new: true },
        });
        if (!unlikePost) {
            throw new common_1.NotFoundException('post does not exist');
        }
        return unlikePost;
    }
    async addAttachments(userId, files, postId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (!files?.length) {
            throw new common_1.BadRequestException('files does not exist');
        }
        const post = await this.postRepo.findOne({
            filter: { _id: postId, createdBy: userId, deletedAt: null },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        const keys = (await this.S3BucketService.uploadFiles({
            files,
            path: '/post',
            storageApproach: multer_enum_1.StorageApproachEnum.MEMORY,
        })).filter((key) => Boolean(key));
        await this.postRepo.findOneAndUpdate({
            filter: { _id: postId, createdBy: userId, deletedAt: null },
            update: { $push: { attachments: { $each: keys } } },
            options: { new: true },
        });
        return 'attachment added successfully';
    }
    async removeAttachments(userId, attachmentKey, postId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (!attachmentKey?.length) {
            throw new common_1.BadRequestException('please select an attachment');
        }
        const post = await this.postRepo.findOne({
            filter: { _id: postId, createdBy: userId, deletedAt: null },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        const ownedKeys = attachmentKey.filter((key) => post.attachments.includes(key));
        if (!ownedKeys.length) {
            throw new common_1.BadRequestException('attachment does not belong to post');
        }
        await this.S3BucketService.deleteFiles(ownedKeys);
        await this.postRepo.findOneAndUpdate({
            filter: { _id: postId, createdBy: userId, deletedAt: null },
            update: { $pull: { attachments: { $in: ownedKeys } } },
        });
        return 'attachment deleted successfully';
    }
    async getHomeFeed(viewerId, page, limit) {
        if (!(await this.userRepo.findById({ id: viewerId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        if (page < 1) {
            page = 1;
        }
        if (limit < 1) {
            limit = 20;
        }
        const followingIds = await this.followService.getFollowingIds(viewerId);
        const homeFeed = await this.postRepo.findAll({
            filter: {
                deletedAt: null,
                $or: [
                    { createdBy: viewerId },
                    {
                        createdBy: { $in: followingIds },
                        privacy: { $in: [post_enum_1.PrivacyEnum.PUBLIC, post_enum_1.PrivacyEnum.FRIENDS] },
                    },
                ],
            },
            options: {
                sort: { createdAt: -1 },
                skip: (page - 1) * limit,
                limit,
            },
        });
        return homeFeed;
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [post_repo_1.PostRepo,
        user_repo_1.UserRepo,
        s3Bucket_service_1.S3BucketService,
        follow_service_1.FollowService,
        event_emitter_1.EventEmitter2])
], PostService);
//# sourceMappingURL=post.service.js.map
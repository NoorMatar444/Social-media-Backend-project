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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const user_repo_1 = require("../../Repo/user.repo");
const post_repo_1 = require("../../Repo/post.repo");
const comment_repo_1 = require("../../Repo/comment.repo");
const post_service_1 = require("../post/post.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const mongoose_1 = require("mongoose");
const post_commented_event_1 = require("../../common/events/post-commented.event");
let CommentService = class CommentService {
    userRepo;
    postRepo;
    CommentRepo;
    postService;
    eventEmitter;
    constructor(userRepo, postRepo, CommentRepo, postService, eventEmitter) {
        this.userRepo = userRepo;
        this.postRepo = postRepo;
        this.CommentRepo = CommentRepo;
        this.postService = postService;
        this.eventEmitter = eventEmitter;
    }
    async createComment(postId, userId, body) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const post = await this.postRepo.findOne({
            filter: {
                _id: postId,
                deletedAt: null,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        await this.postService.assertCanViewPost(post, userId);
        let parentComment = null;
        if (body.parentId) {
            parentComment = await this.CommentRepo.findOne({
                filter: { _id: body.parentId, postId, deletedAt: null },
            });
            if (!parentComment) {
                throw new common_1.BadRequestException('can not find parent comment');
            }
        }
        const comment = await this.CommentRepo.create({
            data: {
                postId,
                createdBy: userId,
                content: body.content,
                parentId: body.parentId ?? null,
            },
        });
        const actorId = new mongoose_1.Types.ObjectId(userId);
        const postObjectId = new mongoose_1.Types.ObjectId(postId);
        if (post.createdBy.toString() !== userId.toString()) {
            this.eventEmitter.emit('post.commented', new post_commented_event_1.PostCommentedEvent(actorId, postObjectId, comment._id, post.createdBy));
        }
        if (parentComment &&
            parentComment.createdBy.toString() !== userId.toString() &&
            parentComment.createdBy.toString() !== post.createdBy.toString()) {
            this.eventEmitter.emit('post.commented', new post_commented_event_1.PostCommentedEvent(actorId, postObjectId, comment._id, parentComment.createdBy));
        }
        return comment;
    }
    async getPostComments(postId, userId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const post = await this.postRepo.findOne({
            filter: {
                _id: postId,
                deletedAt: null,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        await this.postService.assertCanViewPost(post, userId);
        const comment = await this.CommentRepo.findAll({
            filter: { postId, deletedAt: null },
            projection: '-deletedAt',
            options: {
                populate: [
                    {
                        path: 'createdBy',
                        select: 'userName profilePicture',
                    },
                ],
            },
        });
        return comment;
    }
    async getComment(commentId, userId) {
        if (!(await this.userRepo.findById({ id: userId }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const comment = await this.CommentRepo.findOne({
            filter: { _id: commentId, deletedAt: null },
            options: {
                populate: [
                    {
                        path: 'createdBy',
                        select: 'userName profilePicture',
                    },
                ],
            },
        });
        if (!comment) {
            throw new common_1.NotFoundException('comment does not exist');
        }
        const post = await this.postRepo.findOne({
            filter: {
                _id: comment.postId,
                deletedAt: null,
            },
        });
        if (!post) {
            throw new common_1.NotFoundException('post does not exist');
        }
        await this.postService.assertCanViewPost(post, userId);
        return comment;
    }
    async updateComment(commentId, userId, body) {
        const updatedComment = await this.CommentRepo.findOneAndUpdate({
            filter: { _id: commentId, createdBy: userId, deletedAt: null },
            update: { ...body },
            options: { new: true },
        });
        return updatedComment;
    }
    async deleteComment(commentId, userId) {
        await this.CommentRepo.findOneAndUpdate({
            filter: { _id: commentId, createdBy: userId, deletedAt: null },
            update: { deletedAt: new Date() },
        });
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repo_1.UserRepo,
        post_repo_1.PostRepo,
        comment_repo_1.CommentRepo,
        post_service_1.PostService,
        event_emitter_1.EventEmitter2])
], CommentService);
//# sourceMappingURL=comment.sevice.js.map
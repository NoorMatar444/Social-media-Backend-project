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
const post_enum_1 = require("../../common/enums/post.enum");
const comment_repo_1 = require("../../Repo/comment.repo");
let CommentService = class CommentService {
    userRepo;
    postRepo;
    CommentRepo;
    constructor(userRepo, postRepo, CommentRepo) {
        this.userRepo = userRepo;
        this.postRepo = postRepo;
        this.CommentRepo = CommentRepo;
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
        if (post.privacy !== post_enum_1.PrivacyEnum.PUBLIC) {
            throw new common_1.ForbiddenException('can not create comment');
        }
        if (body.parentId) {
            await this.CommentRepo.findOne({
                filter: { _id: body.parentId, postId, deletedAt: null },
            });
        }
        else {
            throw new common_1.BadRequestException('can not find parent comment');
        }
        const comment = await this.CommentRepo.create({
            data: {
                postId,
                createdBy: userId,
                content: body.content,
                parentId: body.parentId ?? null,
            },
        });
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
        if (post.privacy !== post_enum_1.PrivacyEnum.PUBLIC) {
            throw new common_1.ForbiddenException('can not create comment');
        }
        const comment = await this.CommentRepo.findAll({
            filter: { postId, deletedAt: null },
            projection: '-deletedAt',
            options: {
                populate: [
                    {
                        path: 'createdBy',
                    },
                    {
                        path: 'userName profilePicture',
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
        const comment = await this.CommentRepo.findAll({
            filter: { _id: commentId, deletedAt: null },
            options: {
                populate: [
                    {
                        path: 'createdBy',
                    },
                    {
                        path: 'userName profilePicture',
                    },
                ],
            },
        });
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
        comment_repo_1.CommentRepo])
], CommentService);
//# sourceMappingURL=comment.sevice.js.map
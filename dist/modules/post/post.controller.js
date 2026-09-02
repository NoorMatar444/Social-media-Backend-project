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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_decorator_1 = require("../../common/decorator/user.decorator");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
const post_dto_1 = require("./post.dto");
const post_service_1 = require("./post.service");
let PostController = class PostController {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    CreatePost(user, body, files) {
        return this.postService.createPost(body, user, files);
    }
    GetHomeFeed(user, page, limit) {
        return this.postService.getHomeFeed(user._id.toString(), Number(page) || 1, Number(limit) || 20);
    }
    GetUserPosts(user, userId) {
        return this.postService.getUserPosts(userId, user._id.toString());
    }
    GetPost(user, postId) {
        return this.postService.getPost(postId, user._id.toString());
    }
    UpdatePost(user, postId, body) {
        return this.postService.updatePost(body, user._id.toString(), postId);
    }
    DeletePost(user, postId) {
        return this.postService.deletePost(postId, user._id.toString());
    }
    LikePost(user, postId) {
        return this.postService.likePost(user._id.toString(), postId);
    }
    UnlikePost(user, postId) {
        return this.postService.unlikePost(user._id.toString(), postId);
    }
    AddAttachments(user, postId, files) {
        return this.postService.addAttachments(user._id.toString(), files, postId);
    }
    RemoveAttachments(user, postId, body) {
        return this.postService.removeAttachments(user._id.toString(), body.attachmentKey, postId);
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, post_dto_1.CreatePostDto, Array]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "CreatePost", null);
__decorate([
    (0, common_1.Get)('feed'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "GetHomeFeed", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "GetUserPosts", null);
__decorate([
    (0, common_1.Get)('get/:postId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "GetPost", null);
__decorate([
    (0, common_1.Patch)('update/:postId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "UpdatePost", null);
__decorate([
    (0, common_1.Delete)('delete/:postId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "DeletePost", null);
__decorate([
    (0, common_1.Patch)(':postId/like'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "LikePost", null);
__decorate([
    (0, common_1.Patch)(':postId/unlike'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "UnlikePost", null);
__decorate([
    (0, common_1.Post)(':postId/attachments'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "AddAttachments", null);
__decorate([
    (0, common_1.Delete)(':postId/attachments'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, post_dto_1.RemoveAttachmentsDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "RemoveAttachments", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
//# sourceMappingURL=post.controller.js.map
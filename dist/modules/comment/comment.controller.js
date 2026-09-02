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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../common/decorator/user.decorator");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
const comment_dto_1 = require("./comment.dto");
const comment_sevice_1 = require("./comment.sevice");
let CommentController = class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    CreateComment(user, postId, body) {
        return this.commentService.createComment(postId, user._id.toString(), body);
    }
    GetPostComments(user, postId) {
        return this.commentService.getPostComments(postId, user._id.toString());
    }
    GetComment(user, commentId) {
        return this.commentService.getComment(commentId, user._id.toString());
    }
    UpdateComment(user, commentId, body) {
        return this.commentService.updateComment(commentId, user._id.toString(), body);
    }
    DeleteComment(user, commentId) {
        return this.commentService.deleteComment(commentId, user._id.toString());
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Post)(':postId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "CreateComment", null);
__decorate([
    (0, common_1.Get)('post/:postId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "GetPostComments", null);
__decorate([
    (0, common_1.Get)('get/:commentId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "GetComment", null);
__decorate([
    (0, common_1.Patch)('update/:commentId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, comment_dto_1.UpdateCommentDto]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "UpdateComment", null);
__decorate([
    (0, common_1.Delete)('delete/:commentId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "DeleteComment", null);
exports.CommentController = CommentController = __decorate([
    (0, common_1.Controller)('comment'),
    __metadata("design:paramtypes", [comment_sevice_1.CommentService])
], CommentController);
//# sourceMappingURL=comment.controller.js.map
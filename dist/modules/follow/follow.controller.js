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
exports.FollowController = void 0;
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("../../common/decorator/user.decorator");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
const follow_service_1 = require("./follow.service");
let FollowController = class FollowController {
    followService;
    constructor(followService) {
        this.followService = followService;
    }
    GetFollowers(userId, page, limit) {
        return this.followService.getFollowers(userId, page, limit);
    }
    GetFollowing(userId) {
        return this.followService.getFollowing(userId);
    }
    GetFollowCounts(userId) {
        return this.followService.getFollowCounts(userId);
    }
    IsFollowing(user, userId) {
        const followerId = user._id.toString();
        const followingId = userId;
        return this.followService.isFollowing(followerId, followingId);
    }
    FollowUser(user, userId) {
        const followerId = user._id.toString();
        const followingId = userId;
        return this.followService.followUser(followerId, followingId);
    }
    UnfollowUser(user, userId) {
        const followerId = user._id.toString();
        const followingId = userId;
        return this.followService.unfollowUser(followerId, followingId);
    }
};
exports.FollowController = FollowController;
__decorate([
    (0, common_1.Get)(':userId/followers'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "GetFollowers", null);
__decorate([
    (0, common_1.Get)(':userId/following'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "GetFollowing", null);
__decorate([
    (0, common_1.Get)(':userId/counts'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "GetFollowCounts", null);
__decorate([
    (0, common_1.Get)(':userId/status'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "IsFollowing", null);
__decorate([
    (0, common_1.Post)(':userId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "FollowUser", null);
__decorate([
    (0, common_1.Delete)(':userId'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FollowController.prototype, "UnfollowUser", null);
exports.FollowController = FollowController = __decorate([
    (0, common_1.Controller)('follow'),
    __metadata("design:paramtypes", [follow_service_1.FollowService])
], FollowController);
//# sourceMappingURL=follow.controller.js.map
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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_decorator_1 = require("../../common/decorator/user.decorator");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
const user_dto_1 = require("./user.dto");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    GetMyProfile(user) {
        return this.userService.getMyProfile(user._id.toString());
    }
    UpdateProfile(user, body) {
        return this.userService.updateProfile(user._id.toString(), body);
    }
    UpdatePhone(user, body) {
        return this.userService.updatePhone(user._id.toString(), body.phone);
    }
    ChangePassword(user, body) {
        return this.userService.changePassword(user._id.toString(), body);
    }
    UploadProfilePicture(user, file) {
        return this.userService.uploadProfilePicture(user._id.toString(), file);
    }
    RemoveProfilePicture(user) {
        return this.userService.removeProfilePicture(user._id.toString());
    }
    UploadCoverPictures(user, files) {
        return this.userService.uploadCoverPictures(user._id.toString(), files);
    }
    RemoveCoverPicture(user, body) {
        return this.userService.removeCoverPicture(user._id.toString(), body.pictureKey);
    }
    DeactivateAccount(user) {
        return this.userService.deactivateAccount(user._id.toString());
    }
    DeleteAccount(user, body = {}) {
        return this.userService.deleteAccount(user._id.toString(), body.password);
    }
    GetPublicProfile(id) {
        return this.userService.getPublicProfile(id);
    }
    GetUserByUserName(userName) {
        return this.userService.getUserByUserName(userName);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "GetMyProfile", null);
__decorate([
    (0, common_1.Patch)('me/update-profile'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "UpdateProfile", null);
__decorate([
    (0, common_1.Patch)('me/phone'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdatePhoneDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "UpdatePhone", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "ChangePassword", null);
__decorate([
    (0, common_1.Post)('me/profile-picture'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "UploadProfilePicture", null);
__decorate([
    (0, common_1.Delete)('me/profile-picture'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "RemoveProfilePicture", null);
__decorate([
    (0, common_1.Post)('me/cover-pictures'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "UploadCoverPictures", null);
__decorate([
    (0, common_1.Delete)('me/cover-pictures'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.RemoveCoverPictureDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "RemoveCoverPicture", null);
__decorate([
    (0, common_1.Patch)('me/deactivate'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "DeactivateAccount", null);
__decorate([
    (0, common_1.Delete)('me/delete'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthGuard),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.DeleteAccountDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "DeleteAccount", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "GetPublicProfile", null);
__decorate([
    (0, common_1.Get)(':userName'),
    __param(0, (0, common_1.Param)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "GetUserByUserName", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map
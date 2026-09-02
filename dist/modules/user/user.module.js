"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const redis_module_1 = require("../../common/services/Redis/redis.module");
const token_service_1 = require("../../common/services/token.service");
const user_model_1 = require("../../models/user.model");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
const security_module_1 = require("../../Security/security.module");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const user_repo_1 = require("../../Repo/user.repo");
const s3Bucket_service_1 = require("../../common/services/s3Bucket.service");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: user_model_1.User.name,
                    schema: user_model_1.userSchema,
                },
            ]),
            redis_module_1.RedisModule,
            security_module_1.SecurityModule,
        ],
        providers: [token_service_1.TokenService, authentication_guard_1.AuthGuard, user_service_1.UserService, user_repo_1.UserRepo, s3Bucket_service_1.S3BucketService],
        controllers: [user_controller_1.UserController],
        exports: [user_service_1.UserService, user_repo_1.UserRepo],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map
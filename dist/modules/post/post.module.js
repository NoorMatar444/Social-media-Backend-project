"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const post_model_1 = require("../../models/post.model");
const post_service_1 = require("./post.service");
const post_controller_1 = require("./post.controller");
const token_service_1 = require("../../common/services/token.service");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
const post_repo_1 = require("../../Repo/post.repo");
const s3Bucket_service_1 = require("../../common/services/s3Bucket.service");
const user_module_1 = require("../user/user.module");
const redis_module_1 = require("../../common/services/Redis/redis.module");
const follow_module_1 = require("../follow/follow.module");
let PostModule = class PostModule {
};
exports.PostModule = PostModule;
exports.PostModule = PostModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: post_model_1.Post.name,
                    schema: post_model_1.postSchema,
                },
            ]),
            user_module_1.UserModule,
            redis_module_1.RedisModule,
            follow_module_1.FollowModule,
        ],
        providers: [token_service_1.TokenService, authentication_guard_1.AuthGuard, post_service_1.PostService, post_repo_1.PostRepo, s3Bucket_service_1.S3BucketService],
        controllers: [post_controller_1.PostController],
        exports: [post_repo_1.PostRepo, post_service_1.PostService],
    })
], PostModule);
//# sourceMappingURL=post.module.js.map
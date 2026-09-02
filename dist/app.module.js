"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const redis_module_1 = require("./common/services/Redis/redis.module");
const user_module_1 = require("./modules/user/user.module");
const post_module_1 = require("./modules/post/post.module");
const comment_module_1 = require("./modules/comment/comment.module");
const follow_module_1 = require("./modules/follow/follow.module");
const security_module_1 = require("./Security/security.module");
const auth_module_1 = require("./modules/auth/auth.module");
const multer_module_1 = require("./common/multer/multer.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.dev',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('DB_URL') ?? config.get('DB_LOCAL_URL'),
                    onConnectionCreate: (connection) => {
                        connection.on('connected', () => console.log('BD connected'));
                        connection.on('open', () => console.log('BD open'));
                        connection.on('disconnected', () => console.log('BD disconnected'));
                        connection.on('reconnected', () => console.log('BD reconnected'));
                        connection.on('disconnecting', () => console.log('BD disconnecting'));
                        return connection;
                    },
                }),
            }),
            redis_module_1.RedisModule,
            user_module_1.UserModule,
            post_module_1.PostModule,
            comment_module_1.CommentModule,
            follow_module_1.FollowModule,
            security_module_1.SecurityModule,
            auth_module_1.AuthModule,
            multer_module_1.CustomMulterModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
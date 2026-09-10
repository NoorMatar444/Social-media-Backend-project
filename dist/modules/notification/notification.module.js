"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const notification_model_1 = require("../../models/notification.model");
const user_module_1 = require("../user/user.module");
const redis_module_1 = require("../../common/services/Redis/redis.module");
const notification_repo_1 = require("../../Repo/notification.repo");
const notification_gateway_1 = require("./notification.gateway");
const token_service_1 = require("../../common/services/token.service");
const authentication_guard_1 = require("../../Security/Guards/authentication.guard");
const notification_service_1 = require("./notification.service");
const notification_controller_1 = require("./notification.controller");
const createLikeNotificationListener_1 = require("./listeners/createLikeNotificationListener");
const createCommentNotificationListener_1 = require("./listeners/createCommentNotificationListener");
const createFollowNotificationListener_1 = require("./listeners/createFollowNotificationListener");
const createMentionNotificationListener_1 = require("./listeners/createMentionNotificationListener");
const notificationRealtimeListener_1 = require("./listeners/notificationRealtimeListener");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: notification_model_1.Notification.name,
                    schema: notification_model_1.notificationSchema,
                },
            ]),
            user_module_1.UserModule,
            redis_module_1.RedisModule,
        ],
        providers: [
            notification_repo_1.NotificationRepo,
            notification_gateway_1.NotificationGateWay,
            token_service_1.TokenService,
            authentication_guard_1.AuthGuard,
            notification_service_1.NotificationService,
            createLikeNotificationListener_1.createLikeNotification,
            createCommentNotificationListener_1.createCommentNotification,
            createFollowNotificationListener_1.createFollowNotification,
            createMentionNotificationListener_1.createMentionNotification,
            notificationRealtimeListener_1.NotificationRealtime,
        ],
        controllers: [notification_controller_1.NotificationController],
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);
//# sourceMappingURL=notification.module.js.map
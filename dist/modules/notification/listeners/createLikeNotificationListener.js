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
exports.createLikeNotification = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const post_liked_event_1 = require("../../../common/events/post-liked.event");
const notification_service_1 = require("../notification.service");
let createLikeNotification = class createLikeNotification {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async handleCreateLikedNotification(event) {
        return await this.notificationService.createLikeNotification(event);
    }
};
exports.createLikeNotification = createLikeNotification;
__decorate([
    (0, event_emitter_1.OnEvent)('post.liked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_liked_event_1.PostLikedEvent]),
    __metadata("design:returntype", Promise)
], createLikeNotification.prototype, "handleCreateLikedNotification", null);
exports.createLikeNotification = createLikeNotification = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], createLikeNotification);
//# sourceMappingURL=createLikeNotificationListener.js.map
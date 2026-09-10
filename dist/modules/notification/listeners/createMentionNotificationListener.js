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
exports.createMentionNotification = void 0;
const common_1 = require("@nestjs/common");
const notification_service_1 = require("../notification.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const user_mentioned_event_1 = require("../../../common/events/user-mentioned.event");
let createMentionNotification = class createMentionNotification {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async handleCreateMentionNotification(event) {
        return await this.notificationService.createMentionNotification(event);
    }
};
exports.createMentionNotification = createMentionNotification;
__decorate([
    (0, event_emitter_1.OnEvent)('user.mentioned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_mentioned_event_1.UserMentionedEvent]),
    __metadata("design:returntype", Promise)
], createMentionNotification.prototype, "handleCreateMentionNotification", null);
exports.createMentionNotification = createMentionNotification = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], createMentionNotification);
//# sourceMappingURL=createMentionNotificationListener.js.map
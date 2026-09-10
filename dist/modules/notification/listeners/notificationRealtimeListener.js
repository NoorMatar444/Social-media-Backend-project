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
exports.NotificationRealtime = void 0;
const common_1 = require("@nestjs/common");
const notification_gateway_1 = require("../notification.gateway");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_created_event_1 = require("../../../common/events/notification-created.event");
let NotificationRealtime = class NotificationRealtime {
    NotificationGateWay;
    constructor(NotificationGateWay) {
        this.NotificationGateWay = NotificationGateWay;
    }
    handleNotificationCreated(event) {
        const userId = event.notification.receiver.toString();
        this.NotificationGateWay.sendToUser(userId, event.notification);
    }
};
exports.NotificationRealtime = NotificationRealtime;
__decorate([
    (0, event_emitter_1.OnEvent)('notification.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notification_created_event_1.NotificationCreatedEvent]),
    __metadata("design:returntype", void 0)
], NotificationRealtime.prototype, "handleNotificationCreated", null);
exports.NotificationRealtime = NotificationRealtime = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_gateway_1.NotificationGateWay])
], NotificationRealtime);
//# sourceMappingURL=notificationRealtimeListener.js.map
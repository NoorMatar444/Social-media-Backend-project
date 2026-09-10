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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_repo_1 = require("../../Repo/notification.repo");
const user_repo_1 = require("../../Repo/user.repo");
const notification_created_event_1 = require("../../common/events/notification-created.event");
const notification_enum_1 = require("../../common/enums/notification.enum");
let NotificationService = class NotificationService {
    notificationRepo;
    userRepo;
    EventEmitter;
    constructor(notificationRepo, userRepo, EventEmitter) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
        this.EventEmitter = EventEmitter;
    }
    async getUserNotifications(userId, page, limit) {
        const notification = await this.notificationRepo.findAll({
            filter: { receiver: userId },
            options: {
                skip: (page - 1) * limit,
                limit,
                sort: { createdAt: -1 },
            },
        });
        return notification;
    }
    async markAsRead(notificationId, userId) {
        if (!(await this.userRepo.findOne({ filter: { _id: userId } }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const updatedNotification = await this.notificationRepo.findOneAndUpdate({
            filter: { _id: notificationId, receiver: userId },
            update: { $set: { isRead: true } },
        });
        if (!updatedNotification) {
            throw new common_1.NotFoundException('notification does not exist');
        }
        return updatedNotification;
    }
    async deleteNotification(notificationId, userId) {
        if (!(await this.userRepo.findOne({ filter: { _id: userId } }))) {
            throw new common_1.NotFoundException('user does not exist');
        }
        const deletedNotification = await this.notificationRepo.findOneAndDelete({
            filter: { _id: notificationId, receiver: userId },
        });
        if (!deletedNotification) {
            throw new common_1.NotFoundException('notification does not exist');
        }
        return 'notification deleted successfully';
    }
    async persistAndPublish(data) {
        const createdNotification = await this.notificationRepo.create({ data });
        const notification = Array.isArray(createdNotification)
            ? createdNotification[0]
            : createdNotification;
        this.EventEmitter.emit('notification.created', new notification_created_event_1.NotificationCreatedEvent(notification));
        return notification;
    }
    async createLikeNotification(event) {
        if (event.actorId.toString() === event.receiverId.toString()) {
            return;
        }
        return this.persistAndPublish({
            receiver: event.receiverId,
            actor: event.actorId,
            title: 'New like',
            message: 'Someone liked your post',
            notificationType: notification_enum_1.NotificationEnum.LIKE,
            isRead: false,
            relatedEntityId: event.postId,
        });
    }
    async createCommentNotification(event) {
        if (event.actorId.toString() === event.receiverId.toString()) {
            return;
        }
        return this.persistAndPublish({
            receiver: event.receiverId,
            actor: event.actorId,
            title: 'New comment',
            message: 'Someone commented on your post',
            notificationType: notification_enum_1.NotificationEnum.COMMENT,
            isRead: false,
            relatedEntityId: event.commentId,
        });
    }
    async createFollowNotification(event) {
        if (event.actorId.toString() === event.receiverId.toString()) {
            return;
        }
        return this.persistAndPublish({
            receiver: event.receiverId,
            actor: event.actorId,
            title: 'New follower',
            message: 'Someone followed you',
            notificationType: notification_enum_1.NotificationEnum.FOLLOW,
            isRead: false,
        });
    }
    async createMentionNotification(event) {
        if (event.actorId.toString() === event.receiverId.toString()) {
            return;
        }
        return this.persistAndPublish({
            receiver: event.receiverId,
            actor: event.actorId,
            title: 'New mention',
            message: 'Someone mentioned you in a post',
            notificationType: notification_enum_1.NotificationEnum.MENTION,
            isRead: false,
            relatedEntityId: event.postId,
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notification_repo_1.NotificationRepo,
        user_repo_1.UserRepo,
        event_emitter_1.EventEmitter2])
], NotificationService);
//# sourceMappingURL=notification.service.js.map
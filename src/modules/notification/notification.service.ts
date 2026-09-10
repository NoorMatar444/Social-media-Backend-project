import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationRepo } from 'src/Repo/notification.repo';
import { UserRepo } from 'src/Repo/user.repo';
import { HydratedNotification } from 'src/models/notification.model';
import { NotificationCreatedEvent } from 'src/common/events/notification-created.event';
import { PostLikedEvent } from 'src/common/events/post-liked.event';
import { PostCommentedEvent } from 'src/common/events/post-commented.event';
import { UserFollowedEvent } from 'src/common/events/user-followed.event';
import { UserMentionedEvent } from 'src/common/events/user-mentioned.event';
import { NotificationEnum } from 'src/common/enums/notification.enum';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepo,
    private readonly userRepo: UserRepo,
    private readonly EventEmitter: EventEmitter2,
  ) {}
  async getUserNotifications(userId: string, page: number, limit: number) {
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
  async markAsRead(notificationId: string, userId: string) {
    if (!(await this.userRepo.findOne({ filter: { _id: userId } }))) {
      throw new NotFoundException('user does not exist');
    }
    const updatedNotification = await this.notificationRepo.findOneAndUpdate({
      filter: { _id: notificationId, receiver: userId },
      update: { $set: { isRead: true } },
    });
    if (!updatedNotification) {
      throw new NotFoundException('notification does not exist');
    }
    return updatedNotification;
  }
  async deleteNotification(notificationId: string, userId: string) {
    if (!(await this.userRepo.findOne({ filter: { _id: userId } }))) {
      throw new NotFoundException('user does not exist');
    }
    const deletedNotification = await this.notificationRepo.findOneAndDelete({
      filter: { _id: notificationId, receiver: userId },
    });
    if (!deletedNotification) {
      throw new NotFoundException('notification does not exist');
    }
    return 'notification deleted successfully';
  }
  private async persistAndPublish(
    data: Record<string, unknown>,
  ): Promise<HydratedNotification> {
    const createdNotification = await this.notificationRepo.create({ data });
    const notification: HydratedNotification = Array.isArray(
      createdNotification,
    )
      ? (createdNotification[0] as HydratedNotification)
      : createdNotification;
    this.EventEmitter.emit(
      'notification.created',
      new NotificationCreatedEvent(notification),
    );
    return notification;
  }
  async createLikeNotification(event: PostLikedEvent) {
    if (event.actorId.toString() === event.receiverId.toString()) {
      return;
    }
    return this.persistAndPublish({
      receiver: event.receiverId,
      actor: event.actorId,
      title: 'New like',
      message: 'Someone liked your post',
      notificationType: NotificationEnum.LIKE,
      isRead: false,
      relatedEntityId: event.postId,
    });
  }
  async createCommentNotification(event: PostCommentedEvent) {
    if (event.actorId.toString() === event.receiverId.toString()) {
      return;
    }
    return this.persistAndPublish({
      receiver: event.receiverId,
      actor: event.actorId,
      title: 'New comment',
      message: 'Someone commented on your post',
      notificationType: NotificationEnum.COMMENT,
      isRead: false,
      relatedEntityId: event.commentId,
    });
  }
  async createFollowNotification(event: UserFollowedEvent) {
    if (event.actorId.toString() === event.receiverId.toString()) {
      return;
    }
    return this.persistAndPublish({
      receiver: event.receiverId,
      actor: event.actorId,
      title: 'New follower',
      message: 'Someone followed you',
      notificationType: NotificationEnum.FOLLOW,
      isRead: false,
    });
  }
  async createMentionNotification(event: UserMentionedEvent) {
    if (event.actorId.toString() === event.receiverId.toString()) {
      return;
    }
    return this.persistAndPublish({
      receiver: event.receiverId,
      actor: event.actorId,
      title: 'New mention',
      message: 'Someone mentioned you in a post',
      notificationType: NotificationEnum.MENTION,
      isRead: false,
      relatedEntityId: event.postId,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostCommentedEvent } from 'src/common/events/post-commented.event';
import { NotificationService } from '../notification.service';

@Injectable()
export class createCommentNotification {
  constructor(private readonly notificationService: NotificationService) {}
  @OnEvent('post.commented')
  async handleCreateCommentNotification(event: PostCommentedEvent) {
    return await this.notificationService.createCommentNotification(event);
  }
}

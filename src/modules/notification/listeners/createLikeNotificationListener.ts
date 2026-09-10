import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostLikedEvent } from 'src/common/events/post-liked.event';
import { NotificationService } from '../notification.service';

@Injectable()
export class createLikeNotification {
  constructor(private readonly notificationService: NotificationService) {}
  @OnEvent('post.liked')
  async handleCreateLikedNotification(event: PostLikedEvent) {
    return await this.notificationService.createLikeNotification(event);
  }
}

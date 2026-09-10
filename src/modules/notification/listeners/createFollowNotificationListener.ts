import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserFollowedEvent } from 'src/common/events/user-followed.event';

@Injectable()
export class createFollowNotification {
  constructor(private readonly notificationService: NotificationService) {}
  @OnEvent('user.followed')
  async handleCreateFollowNotification(event: UserFollowedEvent) {
    return await this.notificationService.createFollowNotification(event);
  }
}

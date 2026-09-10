import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { OnEvent } from '@nestjs/event-emitter';
import { UserMentionedEvent } from 'src/common/events/user-mentioned.event';

@Injectable()
export class createMentionNotification {
  constructor(private readonly notificationService: NotificationService) {}
  @OnEvent('user.mentioned')
  async handleCreateMentionNotification(event: UserMentionedEvent) {
    return await this.notificationService.createMentionNotification(event);
  }
}

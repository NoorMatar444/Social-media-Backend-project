import { Injectable } from '@nestjs/common';
import { NotificationGateWay } from '../notification.gateway';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from 'src/common/events/notification-created.event';

@Injectable()
export class NotificationRealtime {
  constructor(private readonly NotificationGateWay: NotificationGateWay) {}
  @OnEvent('notification.created')
  handleNotificationCreated(event: NotificationCreatedEvent) {
    const userId = event.notification.receiver.toString();
    this.NotificationGateWay.sendToUser(userId, event.notification);
  }
}

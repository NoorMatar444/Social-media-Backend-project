import { HydratedNotification } from 'src/models/notification.model';

export class NotificationCreatedEvent {
  constructor(public readonly notification: HydratedNotification) {}
}

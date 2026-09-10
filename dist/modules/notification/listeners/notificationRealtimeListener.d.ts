import { NotificationGateWay } from '../notification.gateway';
import { NotificationCreatedEvent } from "../../../common/events/notification-created.event";
export declare class NotificationRealtime {
    private readonly NotificationGateWay;
    constructor(NotificationGateWay: NotificationGateWay);
    handleNotificationCreated(event: NotificationCreatedEvent): void;
}

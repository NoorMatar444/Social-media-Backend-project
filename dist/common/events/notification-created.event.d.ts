import { HydratedNotification } from "../../models/notification.model";
export declare class NotificationCreatedEvent {
    readonly notification: HydratedNotification;
    constructor(notification: HydratedNotification);
}

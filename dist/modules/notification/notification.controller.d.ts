import type { HydratedUser } from "../../models/user.model";
import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    GetUserNotifications(user: HydratedUser, page?: string, limit?: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    MarkAsRead(user: HydratedUser, notificationId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    DeleteNotification(user: HydratedUser, notificationId: string): Promise<string>;
}

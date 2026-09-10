import { NotificationService } from '../notification.service';
import { UserMentionedEvent } from "../../../common/events/user-mentioned.event";
export declare class createMentionNotification {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    handleCreateMentionNotification(event: UserMentionedEvent): Promise<(import("mongoose").Document<unknown, {}, import("../../../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../../../models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
}

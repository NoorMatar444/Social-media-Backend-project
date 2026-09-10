import { PostCommentedEvent } from "../../../common/events/post-commented.event";
import { NotificationService } from '../notification.service';
export declare class createCommentNotification {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    handleCreateCommentNotification(event: PostCommentedEvent): Promise<(import("mongoose").Document<unknown, {}, import("../../../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../../../models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
}

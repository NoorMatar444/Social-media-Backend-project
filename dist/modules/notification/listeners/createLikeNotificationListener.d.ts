import { PostLikedEvent } from "../../../common/events/post-liked.event";
import { NotificationService } from '../notification.service';
export declare class createLikeNotification {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    handleCreateLikedNotification(event: PostLikedEvent): Promise<(import("mongoose").Document<unknown, {}, import("../../../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../../../models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
}

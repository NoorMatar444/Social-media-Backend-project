import { NotificationService } from '../notification.service';
import { UserFollowedEvent } from "../../../common/events/user-followed.event";
export declare class createFollowNotification {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    handleCreateFollowNotification(event: UserFollowedEvent): Promise<(import("mongoose").Document<unknown, {}, import("../../../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../../../models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
}

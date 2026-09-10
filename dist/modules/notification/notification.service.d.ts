import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationRepo } from "../../Repo/notification.repo";
import { UserRepo } from "../../Repo/user.repo";
import { PostLikedEvent } from "../../common/events/post-liked.event";
import { PostCommentedEvent } from "../../common/events/post-commented.event";
import { UserFollowedEvent } from "../../common/events/user-followed.event";
import { UserMentionedEvent } from "../../common/events/user-mentioned.event";
export declare class NotificationService {
    private readonly notificationRepo;
    private readonly userRepo;
    private readonly EventEmitter;
    constructor(notificationRepo: NotificationRepo, userRepo: UserRepo, EventEmitter: EventEmitter2);
    getUserNotifications(userId: string, page: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, import("src/models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markAsRead(notificationId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("src/models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteNotification(notificationId: string, userId: string): Promise<string>;
    private persistAndPublish;
    createLikeNotification(event: PostLikedEvent): Promise<(import("mongoose").Document<unknown, {}, import("src/models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    createCommentNotification(event: PostCommentedEvent): Promise<(import("mongoose").Document<unknown, {}, import("src/models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    createFollowNotification(event: UserFollowedEvent): Promise<(import("mongoose").Document<unknown, {}, import("src/models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    createMentionNotification(event: UserMentionedEvent): Promise<(import("mongoose").Document<unknown, {}, import("src/models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/notification.model").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
}

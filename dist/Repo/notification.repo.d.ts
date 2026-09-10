import { DbRepo } from './Db.repo';
import { Notification } from "../models/notification.model";
import { Model } from 'mongoose';
export declare class NotificationRepo extends DbRepo<Notification> {
    private readonly notificationModel;
    constructor(notificationModel: Model<Notification>);
}

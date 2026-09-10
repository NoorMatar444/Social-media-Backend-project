import { Injectable } from '@nestjs/common';
import { DbRepo } from './Db.repo';
import { Notification } from 'src/models/notification.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationRepo extends DbRepo<Notification> {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {
    super(notificationModel);
  }
}

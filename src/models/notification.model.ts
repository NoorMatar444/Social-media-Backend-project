import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import { NotificationEnum } from 'src/common/enums/notification.enum';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiver!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  actor!: Types.ObjectId;
  @Prop({ type: String, required: true })
  title!: string;
  @Prop({ type: String, required: true })
  message!: string;
  @Prop({ type: String, enum: NotificationEnum, required: true })
  notificationType!: NotificationEnum;
  @Prop({ type: Boolean, default: false })
  isRead!: boolean;
  @Prop({ type: Types.ObjectId })
  relatedEntityId!: Types.ObjectId;
}
export type HydratedNotification = HydratedDocument<Notification>;
export const notificationSchema = SchemaFactory.createForClass(Notification);
export const notificationModel = MongooseModule.forFeature([
  {
    name: Notification.name,
    schema: notificationSchema,
  },
]);
export default notificationModel;

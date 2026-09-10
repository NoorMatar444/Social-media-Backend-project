import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  followerId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  followingId!: Types.ObjectId;
}
export const followSchema = SchemaFactory.createForClass(Follow);
// Blocks duplicate follows (same follower + following pair)
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
// Speeds up "who follows this user" (followers list / count)
followSchema.index({ followingId: 1 });
// Speeds up "who this user follows" (following list / feed ids)
followSchema.index({ followerId: 1 });
const followModel = MongooseModule.forFeature([
  {
    name: Follow.name,
    schema: followSchema,
  },
]);
export type HydratedFollow = HydratedDocument<Follow>;
export default followModel;

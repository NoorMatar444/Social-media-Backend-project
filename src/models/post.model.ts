import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PrivacyEnum } from 'src/common/enums/post.enum';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, maxlength: 5000 })
  content?: string;
  @Prop({ type: [String], default: [] })
  attachments!: string[];
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  likes!: Types.ObjectId[];
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  tags!: Types.ObjectId[];
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  createdBy!: Types.ObjectId;
  @Prop({ type: String, enum: PrivacyEnum, default: PrivacyEnum.PUBLIC })
  privacy!: PrivacyEnum;
  @Prop({ type: Date })
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export type HydratedPost = HydratedDocument<Post>;
export const postSchema = SchemaFactory.createForClass(Post);

export const PostModel = MongooseModule.forFeature([
  {
    schema: postSchema,
    name: Post.name,
  },
]);
export default PostModel;

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Post } from './post.model';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, required: true, ref: Post.name })
  postId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Comment.name, default: null })
  parentId?: Types.ObjectId | null;
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  createdBy!: Types.ObjectId;
  @Prop({ type: String, maxlength: 5000 })
  content?: string;
  @Prop({ type: Date })
  deletedAt?: Date;
}
export type HydratedComment = HydratedDocument<Comment>;
export const commentSchema = SchemaFactory.createForClass(Comment);
export const commentModel = MongooseModule.forFeature([
  {
    name: Comment.name,
    schema: commentSchema,
  },
]);
export default commentModel;

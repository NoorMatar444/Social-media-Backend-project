import { Types } from 'mongoose';

export class PostCommentedEvent {
  constructor(
    public readonly actorId: Types.ObjectId,
    public readonly postId: Types.ObjectId,
    public readonly commentId: Types.ObjectId,
    public readonly receiverId: Types.ObjectId,
  ) {}
}

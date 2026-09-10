import { Types } from 'mongoose';

export class UserMentionedEvent {
  constructor(
    public readonly actorId: Types.ObjectId,
    public readonly postId: Types.ObjectId,
    public readonly receiverId: Types.ObjectId,
  ) {}
}

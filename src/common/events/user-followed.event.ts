import { Types } from 'mongoose';

export class UserFollowedEvent {
  constructor(
    public readonly actorId: Types.ObjectId,
    public readonly receiverId: Types.ObjectId,
  ) {}
}

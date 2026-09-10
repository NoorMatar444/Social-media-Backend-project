import { Types } from 'mongoose';
export declare class UserMentionedEvent {
    readonly actorId: Types.ObjectId;
    readonly postId: Types.ObjectId;
    readonly receiverId: Types.ObjectId;
    constructor(actorId: Types.ObjectId, postId: Types.ObjectId, receiverId: Types.ObjectId);
}

import { Types } from 'mongoose';
export declare class PostCommentedEvent {
    readonly actorId: Types.ObjectId;
    readonly postId: Types.ObjectId;
    readonly commentId: Types.ObjectId;
    readonly receiverId: Types.ObjectId;
    constructor(actorId: Types.ObjectId, postId: Types.ObjectId, commentId: Types.ObjectId, receiverId: Types.ObjectId);
}

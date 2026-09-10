import { Types } from 'mongoose';
export declare class UserFollowedEvent {
    readonly actorId: Types.ObjectId;
    readonly receiverId: Types.ObjectId;
    constructor(actorId: Types.ObjectId, receiverId: Types.ObjectId);
}

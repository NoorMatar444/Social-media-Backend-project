"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostLikedEvent = void 0;
class PostLikedEvent {
    actorId;
    postId;
    receiverId;
    constructor(actorId, postId, receiverId) {
        this.actorId = actorId;
        this.postId = postId;
        this.receiverId = receiverId;
    }
}
exports.PostLikedEvent = PostLikedEvent;
//# sourceMappingURL=post-liked.event.js.map
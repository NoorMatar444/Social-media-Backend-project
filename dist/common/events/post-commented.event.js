"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCommentedEvent = void 0;
class PostCommentedEvent {
    actorId;
    postId;
    commentId;
    receiverId;
    constructor(actorId, postId, commentId, receiverId) {
        this.actorId = actorId;
        this.postId = postId;
        this.commentId = commentId;
        this.receiverId = receiverId;
    }
}
exports.PostCommentedEvent = PostCommentedEvent;
//# sourceMappingURL=post-commented.event.js.map
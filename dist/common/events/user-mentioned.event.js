"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMentionedEvent = void 0;
class UserMentionedEvent {
    actorId;
    postId;
    receiverId;
    constructor(actorId, postId, receiverId) {
        this.actorId = actorId;
        this.postId = postId;
        this.receiverId = receiverId;
    }
}
exports.UserMentionedEvent = UserMentionedEvent;
//# sourceMappingURL=user-mentioned.event.js.map
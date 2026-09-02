"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentModel = exports.commentSchema = exports.Comment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_model_1 = require("./post.model");
const user_model_1 = require("./user.model");
let Comment = class Comment {
    postId;
    parentId;
    createdBy;
    content;
    deletedAt;
};
exports.Comment = Comment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: post_model_1.Post.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Comment.prototype, "postId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: Comment.name, default: null }),
    __metadata("design:type", Object)
], Comment.prototype, "parentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: user_model_1.User.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Comment.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, maxlength: 5000 }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Comment.prototype, "deletedAt", void 0);
exports.Comment = Comment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Comment);
exports.commentSchema = mongoose_1.SchemaFactory.createForClass(Comment);
exports.commentModel = mongoose_1.MongooseModule.forFeature([
    {
        name: Comment.name,
        schema: exports.commentSchema,
    },
]);
exports.default = exports.commentModel;
//# sourceMappingURL=comment.model.js.map
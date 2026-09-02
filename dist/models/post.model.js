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
exports.PostModel = exports.postSchema = exports.Post = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_enum_1 = require("../common/enums/post.enum");
const user_model_1 = require("./user.model");
let Post = class Post {
    content;
    attachments;
    likes;
    tags;
    createdBy;
    privacy;
    deletedAt;
    createdAt;
    updatedAt;
};
exports.Post = Post;
__decorate([
    (0, mongoose_1.Prop)({ type: String, maxlength: 5000 }),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: user_model_1.User.name }], default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: user_model_1.User.name }], default: [] }),
    __metadata("design:type", Array)
], Post.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: user_model_1.User.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Post.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: post_enum_1.PrivacyEnum, default: post_enum_1.PrivacyEnum.PUBLIC }),
    __metadata("design:type", String)
], Post.prototype, "privacy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Post.prototype, "deletedAt", void 0);
exports.Post = Post = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Post);
exports.postSchema = mongoose_1.SchemaFactory.createForClass(Post);
exports.PostModel = mongoose_1.MongooseModule.forFeature([
    {
        schema: exports.postSchema,
        name: Post.name,
    },
]);
exports.default = exports.PostModel;
//# sourceMappingURL=post.model.js.map
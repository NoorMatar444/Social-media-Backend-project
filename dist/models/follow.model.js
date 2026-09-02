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
exports.followSchema = exports.Follow = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_model_1 = require("./user.model");
let Follow = class Follow {
    followerId;
    followingId;
};
exports.Follow = Follow;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: user_model_1.User.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Follow.prototype, "followerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true, ref: user_model_1.User.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Follow.prototype, "followingId", void 0);
exports.Follow = Follow = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Follow);
exports.followSchema = mongoose_1.SchemaFactory.createForClass(Follow);
exports.followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
exports.followSchema.index({ followingId: 1 });
exports.followSchema.index({ followerId: 1 });
const followModel = mongoose_1.MongooseModule.forFeature([
    {
        name: Follow.name,
        schema: exports.followSchema,
    },
]);
exports.default = followModel;
//# sourceMappingURL=follow.model.js.map
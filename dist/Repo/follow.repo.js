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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRepo = void 0;
const common_1 = require("@nestjs/common");
const Db_repo_1 = require("./Db.repo");
const mongoose_1 = require("@nestjs/mongoose");
const follow_model_1 = require("../models/follow.model");
const mongoose_2 = require("mongoose");
let FollowRepo = class FollowRepo extends Db_repo_1.DbRepo {
    followModel;
    constructor(followModel) {
        super(followModel);
        this.followModel = followModel;
    }
    async countDocument({ filter }) {
        return await this.followModel.countDocuments(filter);
    }
};
exports.FollowRepo = FollowRepo;
exports.FollowRepo = FollowRepo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(follow_model_1.Follow.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FollowRepo);
//# sourceMappingURL=follow.repo.js.map
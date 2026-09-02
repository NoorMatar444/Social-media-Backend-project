"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbRepo = void 0;
class DbRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ filter, projection, options, }) {
        return await this.model.findOne(filter, projection, options);
    }
    async create({ data }) {
        return await this.model.create(data);
    }
    async findOneAndUpdate({ filter, update, options, }) {
        return await this.model.findOneAndUpdate(filter, update, options);
    }
    async findById({ id, projection, options, }) {
        return await this.model.findById(id, projection, options);
    }
    async findByIdAndDelete({ id }) {
        return await this.model.findByIdAndDelete(id);
    }
    async findAll({ filter, projection, options, }) {
        return await this.model.find(filter, projection, options);
    }
    async findOneAndDelete({ filter, options, }) {
        return await this.model.findOneAndDelete(filter, options);
    }
}
exports.DbRepo = DbRepo;
//# sourceMappingURL=Db.repo.js.map
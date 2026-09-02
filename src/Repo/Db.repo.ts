import {
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

export abstract class DbRepo<T> {
  constructor(private model: Model<T>) {}

  async findOne({
    filter,
    projection,
    options,
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }): Promise<T | null> {
    return await this.model.findOne(filter, projection, options);
  }
  async create({ data }: { data: any }) {
    return await this.model.create(data);
  }
  async findOneAndUpdate({
    filter,
    update,
    options,
  }: {
    filter?: QueryFilter<T>;
    update?: UpdateQuery<T>;
    options?: QueryOptions<T>;
  }) {
    return await this.model.findOneAndUpdate(filter, update, options);
  }
  async findById({
    id,
    projection,
    options,
  }: {
    id?: any;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }) {
    return await this.model.findById(id, projection, options);
  }
  async findByIdAndDelete({ id }: { id: any }) {
    return await this.model.findByIdAndDelete(id);
  }
  async findAll({
    filter,
    projection,
    options,
  }: {
    filter?: QueryFilter<T>;
    projection?: ProjectionType<T>;
    options?: QueryOptions<T>;
  }) {
    return await this.model.find(filter, projection, options);
  }
  async findOneAndDelete({
    filter,
    options,
  }: {
    filter?: QueryFilter<T>;
    options?: QueryOptions<T>;
  }) {
    return await this.model.findOneAndDelete(filter, options);
  }
}

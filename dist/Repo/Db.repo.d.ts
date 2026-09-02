import { Model, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from 'mongoose';
export declare abstract class DbRepo<T> {
    private model;
    constructor(model: Model<T>);
    findOne({ filter, projection, options, }: {
        filter?: QueryFilter<T>;
        projection?: ProjectionType<T>;
        options?: QueryOptions<T>;
    }): Promise<T | null>;
    create({ data }: {
        data: any;
    }): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>>;
    findOneAndUpdate({ filter, update, options, }: {
        filter?: QueryFilter<T>;
        update?: UpdateQuery<T>;
        options?: QueryOptions<T>;
    }): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null>;
    findById({ id, projection, options, }: {
        id?: any;
        projection?: ProjectionType<T>;
        options?: QueryOptions<T>;
    }): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null>;
    findByIdAndDelete({ id }: {
        id: any;
    }): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null>;
    findAll({ filter, projection, options, }: {
        filter?: QueryFilter<T>;
        projection?: ProjectionType<T>;
        options?: QueryOptions<T>;
    }): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>>[]>;
    findOneAndDelete({ filter, options, }: {
        filter?: QueryFilter<T>;
        options?: QueryOptions<T>;
    }): Promise<import("mongoose").IfAny<T, any, import("mongoose").Document<unknown, {}, T, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<T> & {
        __v: number;
    } & import("mongoose").AddDefaultId<T, {}, import("mongoose").DefaultSchemaOptions>> | null>;
}

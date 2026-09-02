import { Types, HydratedDocument } from 'mongoose';
export declare class Follow {
    followerId: Types.ObjectId;
    followingId: Types.ObjectId;
}
export declare const followSchema: import("mongoose").Schema<Follow, import("mongoose").Model<Follow, any, any, any, any, any, Follow>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Follow, import("mongoose").Document<unknown, {}, Follow, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Follow & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    followerId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Follow, import("mongoose").Document<unknown, {}, Follow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Follow & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    followingId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Follow, import("mongoose").Document<unknown, {}, Follow, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Follow & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Follow>;
declare const followModel: import("@nestjs/common").DynamicModule;
export type HydratedFollow = HydratedDocument<Follow>;
export default followModel;

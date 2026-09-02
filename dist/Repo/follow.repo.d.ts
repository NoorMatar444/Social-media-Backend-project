import { DbRepo } from './Db.repo';
import { Follow } from "../models/follow.model";
import { Model, QueryFilter } from 'mongoose';
export declare class FollowRepo extends DbRepo<Follow> {
    private readonly followModel;
    constructor(followModel: Model<Follow>);
    countDocument({ filter }: {
        filter?: QueryFilter<Follow>;
    }): Promise<number>;
}

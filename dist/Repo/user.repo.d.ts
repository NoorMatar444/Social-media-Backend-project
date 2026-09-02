import { DbRepo } from './Db.repo';
import { User } from "../models/user.model";
import { Model } from 'mongoose';
export declare class UserRepo extends DbRepo<User> {
    private readonly userModel;
    constructor(userModel: Model<User>);
}

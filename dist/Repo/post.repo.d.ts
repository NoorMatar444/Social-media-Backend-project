import { DbRepo } from './Db.repo';
import { Post } from "../models/post.model";
import { Model } from 'mongoose';
export declare class PostRepo extends DbRepo<Post> {
    private readonly postModel;
    constructor(postModel: Model<Post>);
}

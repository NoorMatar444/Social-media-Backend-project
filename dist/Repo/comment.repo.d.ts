import { Model } from 'mongoose';
import { Comment } from "../models/comment.model";
import { DbRepo } from './Db.repo';
export declare class CommentRepo extends DbRepo<Comment> {
    private readonly commentModel;
    constructor(commentModel: Model<Comment>);
}

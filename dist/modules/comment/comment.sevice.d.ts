import { UserRepo } from "../../Repo/user.repo";
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { PostRepo } from "../../Repo/post.repo";
import { CommentRepo } from "../../Repo/comment.repo";
import { PostService } from '../post/post.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { Comment } from "../../models/comment.model";
export declare class CommentService {
    private readonly userRepo;
    private readonly postRepo;
    private readonly CommentRepo;
    private readonly postService;
    private readonly eventEmitter;
    constructor(userRepo: UserRepo, postRepo: PostRepo, CommentRepo: CommentRepo, postService: PostService, eventEmitter: EventEmitter2);
    createComment(postId: string, userId: string, body: CreateCommentDto): Promise<import("mongoose").Document<unknown, {}, Comment, {}, import("mongoose").DefaultSchemaOptions> & Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPostComments(postId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, Comment, {}, import("mongoose").DefaultSchemaOptions> & Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getComment(commentId: string, userId: string): Promise<Comment>;
    updateComment(commentId: string, userId: string, body: UpdateCommentDto): Promise<(import("mongoose").Document<unknown, {}, Comment, {}, import("mongoose").DefaultSchemaOptions> & Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteComment(commentId: string, userId: string): Promise<void>;
}

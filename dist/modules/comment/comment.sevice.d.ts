import { UserRepo } from "../../Repo/user.repo";
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { PostRepo } from "../../Repo/post.repo";
import { CommentRepo } from "../../Repo/comment.repo";
export declare class CommentService {
    private readonly userRepo;
    private readonly postRepo;
    private readonly CommentRepo;
    constructor(userRepo: UserRepo, postRepo: PostRepo, CommentRepo: CommentRepo);
    createComment(postId: string, userId: string, body: CreateCommentDto): Promise<import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPostComments(postId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getComment(commentId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateComment(commentId: string, userId: string, body: UpdateCommentDto): Promise<(import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteComment(commentId: string, userId: string): Promise<void>;
}

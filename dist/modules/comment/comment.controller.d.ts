import type { HydratedUser } from "../../models/user.model";
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentService } from './comment.sevice';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    CreateComment(user: HydratedUser, postId: string, body: CreateCommentDto): Promise<import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    GetPostComments(user: HydratedUser, postId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    GetComment(user: HydratedUser, commentId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    UpdateComment(user: HydratedUser, commentId: string, body: UpdateCommentDto): Promise<(import("mongoose").Document<unknown, {}, import("../../models/comment.model").Comment, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/comment.model").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    DeleteComment(user: HydratedUser, commentId: string): Promise<void>;
}

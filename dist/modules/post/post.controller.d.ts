import type { HydratedUser } from "../../models/user.model";
import { CreatePostDto, RemoveAttachmentsDto, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    CreatePost(user: HydratedUser, body: CreatePostDto, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, import("../../models/post.model").Post, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/post.model").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    GetHomeFeed(user: HydratedUser, page?: string, limit?: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/post.model").Post, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/post.model").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    GetUserPosts(user: HydratedUser, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/post.model").Post, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/post.model").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    GetPost(user: HydratedUser, postId: string): Promise<import("../../models/post.model").Post>;
    UpdatePost(user: HydratedUser, postId: string, body: UpdatePostDto): Promise<import("mongoose").Document<unknown, {}, import("../../models/post.model").Post, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/post.model").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    DeletePost(user: HydratedUser, postId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/post.model").Post, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/post.model").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    LikePost(user: HydratedUser, postId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/post.model").Post, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/post.model").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    UnlikePost(user: HydratedUser, postId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/post.model").Post, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/post.model").Post & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    AddAttachments(user: HydratedUser, postId: string, files: Express.Multer.File[]): Promise<string>;
    RemoveAttachments(user: HydratedUser, postId: string, body: RemoveAttachmentsDto): Promise<string>;
}

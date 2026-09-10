import { CreatePostDto, UpdatePostDto } from './post.dto';
import { HydratedUser } from "../../models/user.model";
import { Post } from "../../models/post.model";
import { PostRepo } from "../../Repo/post.repo";
import { UserRepo } from "../../Repo/user.repo";
import { S3BucketService } from '../../common/services/s3Bucket.service';
import { FollowService } from '../follow/follow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
export declare class PostService {
    private readonly postRepo;
    private readonly userRepo;
    private readonly S3BucketService;
    private readonly followService;
    private readonly eventEmitter;
    constructor(postRepo: PostRepo, userRepo: UserRepo, S3BucketService: S3BucketService, followService: FollowService, eventEmitter: EventEmitter2);
    assertCanViewPost(post: Post, viewerId: string): Promise<void>;
    createPost(body: CreatePostDto, user: HydratedUser, files: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPost(postId: string, userId: string): Promise<Post>;
    getUserPosts(userId: string, viewerId: string): Promise<(import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updatePost(body: UpdatePostDto, userId: string, postId: string): Promise<import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    deletePost(postID: string, userId: string): Promise<import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    likePost(userId: string, postId: string): Promise<import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    unlikePost(userId: string, postId: string): Promise<import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    addAttachments(userId: string, files: Express.Multer.File[], postId: string): Promise<string>;
    removeAttachments(userId: string, attachmentKey: string[], postId: string): Promise<string>;
    getHomeFeed(viewerId: string, page: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, Post, {}, import("mongoose").DefaultSchemaOptions> & Post & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
}

import type { HydratedUser } from "../../models/user.model";
import { FollowService } from './follow.service';
export declare class FollowController {
    private readonly followService;
    constructor(followService: FollowService);
    GetFollowers(userId: string, page: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, import("../../models/follow.model").Follow, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/follow.model").Follow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    GetFollowing(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/follow.model").Follow, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/follow.model").Follow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    GetFollowCounts(userId: string): Promise<{
        followerCount: number;
        followingCount: number;
    }>;
    IsFollowing(user: HydratedUser, userId: string): Promise<{
        following: boolean;
    }>;
    FollowUser(user: HydratedUser, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/follow.model").Follow, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/follow.model").Follow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    UnfollowUser(user: HydratedUser, userId: string): Promise<string>;
}

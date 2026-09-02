import { FollowRepo } from "../../Repo/follow.repo";
import { UserRepo } from "../../Repo/user.repo";
export declare class FollowService {
    private readonly userRepo;
    private readonly followRepo;
    constructor(userRepo: UserRepo, followRepo: FollowRepo);
    followUser(followerId: string, followingId: string): Promise<import("mongoose").Document<unknown, {}, import("../../models/follow.model").Follow, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/follow.model").Follow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    unfollowUser(followerId: string, followingId: string): Promise<string>;
    getFollowers(userId: string, page: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, import("../../models/follow.model").Follow, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/follow.model").Follow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getFollowing(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../models/follow.model").Follow, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/follow.model").Follow & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getFollowCounts(userId: string): Promise<{
        followerCount: number;
        followingCount: number;
    }>;
    isFollowing(followerId: string, followingId: string): Promise<{
        following: boolean;
    }>;
    getFollowingIds(userId: string): Promise<import("mongoose").Types.ObjectId[]>;
}

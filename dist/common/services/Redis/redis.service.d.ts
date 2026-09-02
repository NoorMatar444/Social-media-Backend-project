import Redis, { RedisKey } from 'ioredis';
export declare class RedisService {
    private readonly redis;
    constructor(redis: Redis);
    setRedisKey({ key, value, }: {
        key: RedisKey;
        value: string | Buffer | number;
    }): Promise<"OK">;
    getRedisKey({ key }: {
        key: RedisKey;
    }): Promise<string | null>;
    deleteRedisKey({ key }: {
        key: RedisKey;
    }): Promise<number>;
    isRedisKeyExist({ key }: {
        key: RedisKey;
    }): Promise<number>;
    expireRedisKey({ key, seconds, }: {
        key: RedisKey;
        seconds: number | string;
    }): Promise<number>;
    getBlackListTokenKey({ userId, tokenId, }: {
        userId: string;
        tokenId: string;
    }): string;
}

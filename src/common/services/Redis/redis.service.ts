import { Inject, Injectable } from '@nestjs/common';
import { Redis_Client } from './redis.constant';
import Redis, { RedisKey } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject(Redis_Client) private readonly redis: Redis) {}
  async setRedisKey({
    key,
    value,
  }: {
    key: RedisKey;
    value: string | Buffer | number;
  }) {
    return this.redis.set(key, value);
  }
  async getRedisKey({ key }: { key: RedisKey }) {
    return this.redis.get(key);
  }
  async deleteRedisKey({ key }: { key: RedisKey }) {
    return this.redis.del(key);
  }
  async isRedisKeyExist({ key }: { key: RedisKey }) {
    return this.redis.exists(key);
  }
  async expireRedisKey({
    key,
    seconds,
  }: {
    key: RedisKey;
    seconds: number | string;
  }) {
    return this.redis.expire(key, seconds);
  }
  getBlackListTokenKey({
    userId,
    tokenId,
  }: {
    userId: string;
    tokenId: string;
  }) {
    return `blacklist:${userId}:${tokenId}`;
  }
  async blacklistToken({
    userId,
    tokenId,
    seconds = 365 * 24 * 60 * 60,
  }: {
    userId: string;
    tokenId: string;
    seconds?: number;
  }) {
    const key = this.getBlackListTokenKey({ userId, tokenId });
    await this.setRedisKey({ key, value: '1' });
    await this.expireRedisKey({ key, seconds });
  }
}

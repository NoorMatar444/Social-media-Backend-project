import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisProvider } from './redis.provider';
import { Redis_Client } from './redis.constant';

@Module({
  providers: [RedisProvider, RedisService],
  exports: [Redis_Client, RedisService],
})
export class RedisModule {}

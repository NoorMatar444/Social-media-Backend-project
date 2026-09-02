import { ConfigService } from '@nestjs/config';
import { Redis_Client } from './redis.constant';
import Redis from 'ioredis';

export const RedisProvider = {
  provide: Redis_Client,
  useFactory: (ConfigService: ConfigService) => {
    const redis = new Redis({
      host: ConfigService.get<string>('REDIS_HOST'),
      port: Number(ConfigService.get<string>('REDIS_PORT')),
      db: Number(ConfigService.get<string>('REDIS_DB')),
      password: ConfigService.get<string>('REDIS_PASSWORD'),
    });
    redis.on('connect', () => {
      console.log('redis connected successfully');
    });
    redis.on('error', (error) => {
      console.log(error);
    });
  },
  inject: [ConfigService],
};

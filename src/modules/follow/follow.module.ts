import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, followSchema } from 'src/models/follow.model';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowRepo } from 'src/Repo/follow.repo';
import { UserModule } from '../user/user.module';
import { RedisModule } from 'src/common/services/Redis/redis.module';
import { TokenService } from 'src/common/services/token.service';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Follow.name,
        schema: followSchema,
      },
    ]),
    UserModule,
    RedisModule,
  ],
  providers: [TokenService, AuthGuard, FollowService, FollowRepo],
  controllers: [FollowController],
  exports: [FollowService, FollowRepo],
})
export class FollowModule {}

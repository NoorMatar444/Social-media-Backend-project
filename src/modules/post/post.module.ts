import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, postSchema } from 'src/models/post.model';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TokenService } from 'src/common/services/token.service';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import { PostRepo } from 'src/Repo/post.repo';
import { S3BucketService } from 'src/common/services/s3Bucket.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from 'src/common/services/Redis/redis.module';
import { FollowModule } from '../follow/follow.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: postSchema,
      },
    ]),
    UserModule,
    RedisModule,
    FollowModule,
  ],
  providers: [TokenService, AuthGuard, PostService, PostRepo, S3BucketService],
  controllers: [PostController],
  exports: [PostRepo, PostService],
})
export class PostModule {}

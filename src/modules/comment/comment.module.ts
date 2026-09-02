import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, commentSchema } from 'src/models/comment.model';
import { CommentService } from './comment.sevice';
import { CommentRepo } from 'src/Repo/comment.repo';
import { CommentController } from './comment.controller';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { RedisModule } from 'src/common/services/Redis/redis.module';
import { TokenService } from 'src/common/services/token.service';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: commentSchema,
      },
    ]),
    UserModule,
    PostModule,
    RedisModule,
  ],
  providers: [TokenService, AuthGuard, CommentService, CommentRepo],
  controllers: [CommentController],
})
export class CommentModule {}

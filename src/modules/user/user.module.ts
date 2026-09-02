import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'src/common/services/Redis/redis.module';
import { TokenService } from 'src/common/services/token.service';
import { User, userSchema } from 'src/models/user.model';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import { SecurityModule } from 'src/Security/security.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepo } from 'src/Repo/user.repo';
import { S3BucketService } from 'src/common/services/s3Bucket.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    RedisModule,
    SecurityModule,
  ],
  providers: [TokenService, AuthGuard, UserService, UserRepo, S3BucketService],
  controllers: [UserController],
  exports: [UserService, UserRepo],
})
export class UserModule {}

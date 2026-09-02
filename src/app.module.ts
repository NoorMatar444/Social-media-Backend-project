import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './common/services/Redis/redis.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { FollowModule } from './modules/follow/follow.module';
import { SecurityModule } from './Security/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomMulterModule } from './common/multer/multer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // use ConfigService anywhere without re-importing
      envFilePath:
        process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.dev',
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URL') ?? config.get<string>('DB_LOCAL_URL'), // .env.dev uses DB_LOCAL_URL
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('BD connected'));
          connection.on('open', () => console.log('BD open'));
          connection.on('disconnected', () => console.log('BD disconnected'));
          connection.on('reconnected', () => console.log('BD reconnected'));
          connection.on('disconnecting', () => console.log('BD disconnecting'));
          return connection;
        },
      }),
    }),
    RedisModule,
    UserModule,
    PostModule,
    CommentModule,
    FollowModule,
    SecurityModule,
    AuthModule,
    CustomMulterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

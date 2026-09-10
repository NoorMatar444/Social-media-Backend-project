import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  notificationSchema,
} from 'src/models/notification.model';
import { UserModule } from '../user/user.module';
import { RedisModule } from 'src/common/services/Redis/redis.module';
import { NotificationRepo } from 'src/Repo/notification.repo';
import { NotificationGateWay } from './notification.gateway';
import { TokenService } from 'src/common/services/token.service';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { createLikeNotification } from './listeners/createLikeNotificationListener';
import { createCommentNotification } from './listeners/createCommentNotificationListener';
import { createFollowNotification } from './listeners/createFollowNotificationListener';
import { createMentionNotification } from './listeners/createMentionNotificationListener';
import { NotificationRealtime } from './listeners/notificationRealtimeListener';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: notificationSchema,
      },
    ]),
    UserModule,
    RedisModule,
  ],
  providers: [
    NotificationRepo,
    NotificationGateWay,
    TokenService,
    AuthGuard,
    NotificationService,
    createLikeNotification,
    createCommentNotification,
    createFollowNotification,
    createMentionNotification,
    NotificationRealtime,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}

import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import type { HydratedUser } from 'src/models/user.model';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  GetUserNotifications(
    @CurrentUser() user: HydratedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationService.getUserNotifications(
      user._id.toString(),
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Patch(':notificationId/read')
  @UseGuards(AuthGuard)
  MarkAsRead(
    @CurrentUser() user: HydratedUser,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationService.markAsRead(
      notificationId,
      user._id.toString(),
    );
  }

  @Delete(':notificationId')
  @UseGuards(AuthGuard)
  DeleteNotification(
    @CurrentUser() user: HydratedUser,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationService.deleteNotification(
      notificationId,
      user._id.toString(),
    );
  }
}

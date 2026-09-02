import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import type { HydratedUser } from 'src/models/user.model';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':userId/followers')
  @UseGuards(AuthGuard)
  GetFollowers(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.followService.getFollowers(userId, page, limit);
  }

  @Get(':userId/following')
  @UseGuards(AuthGuard)
  GetFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }

  @Get(':userId/counts')
  @UseGuards(AuthGuard)
  GetFollowCounts(@Param('userId') userId: string) {
    return this.followService.getFollowCounts(userId);
  }

  @Get(':userId/status')
  @UseGuards(AuthGuard)
  IsFollowing(
    @CurrentUser() user: HydratedUser,
    @Param('userId') userId: string,
  ) {
    const followerId = user._id.toString();
    const followingId = userId;
    return this.followService.isFollowing(followerId, followingId);
  }

  @Post(':userId')
  @UseGuards(AuthGuard)
  FollowUser(
    @CurrentUser() user: HydratedUser,
    @Param('userId') userId: string,
  ) {
    const followerId = user._id.toString();
    const followingId = userId;
    return this.followService.followUser(followerId, followingId);
  }

  @Delete(':userId')
  @UseGuards(AuthGuard)
  UnfollowUser(
    @CurrentUser() user: HydratedUser,
    @Param('userId') userId: string,
  ) {
    const followerId = user._id.toString();
    const followingId = userId;
    return this.followService.unfollowUser(followerId, followingId);
  }
}

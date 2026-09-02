import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import type { HydratedUser } from 'src/models/user.model';
import { CreatePostDto, RemoveAttachmentsDto, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  CreatePost(
    @CurrentUser() user: HydratedUser,
    @Body() body: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postService.createPost(body, user, files);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  GetHomeFeed(
    @CurrentUser() user: HydratedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postService.getHomeFeed(
      user._id.toString(),
      Number(page) || 1,
      Number(limit) || 20,
    );
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  GetUserPosts(
    @CurrentUser() user: HydratedUser,
    @Param('userId') userId: string,
  ) {
    return this.postService.getUserPosts(userId, user._id.toString());
  }

  @Get('get/:postId')
  @UseGuards(AuthGuard)
  GetPost(@CurrentUser() user: HydratedUser, @Param('postId') postId: string) {
    return this.postService.getPost(postId, user._id.toString());
  }

  @Patch('update/:postId')
  @UseGuards(AuthGuard)
  UpdatePost(
    @CurrentUser() user: HydratedUser,
    @Param('postId') postId: string,
    @Body() body: UpdatePostDto,
  ) {
    return this.postService.updatePost(body, user._id.toString(), postId);
  }

  @Delete('delete/:postId')
  @UseGuards(AuthGuard)
  DeletePost(
    @CurrentUser() user: HydratedUser,
    @Param('postId') postId: string,
  ) {
    return this.postService.deletePost(postId, user._id.toString());
  }

  @Patch(':postId/like')
  @UseGuards(AuthGuard)
  LikePost(@CurrentUser() user: HydratedUser, @Param('postId') postId: string) {
    return this.postService.likePost(user._id.toString(), postId);
  }

  @Patch(':postId/unlike')
  @UseGuards(AuthGuard)
  UnlikePost(
    @CurrentUser() user: HydratedUser,
    @Param('postId') postId: string,
  ) {
    return this.postService.unlikePost(user._id.toString(), postId);
  }

  @Post(':postId/attachments')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  AddAttachments(
    @CurrentUser() user: HydratedUser,
    @Param('postId') postId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.postService.addAttachments(user._id.toString(), files, postId);
  }

  @Delete(':postId/attachments')
  @UseGuards(AuthGuard)
  RemoveAttachments(
    @CurrentUser() user: HydratedUser,
    @Param('postId') postId: string,
    @Body() body: RemoveAttachmentsDto,
  ) {
    return this.postService.removeAttachments(
      user._id.toString(),
      body.attachmentKey,
      postId,
    );
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import type { HydratedUser } from 'src/models/user.model';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentService } from './comment.sevice';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  @UseGuards(AuthGuard)
  CreateComment(
    @CurrentUser() user: HydratedUser,
    @Param('postId') postId: string,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentService.createComment(postId, user._id.toString(), body);
  }

  @Get('post/:postId')
  @UseGuards(AuthGuard)
  GetPostComments(
    @CurrentUser() user: HydratedUser,
    @Param('postId') postId: string,
  ) {
    return this.commentService.getPostComments(postId, user._id.toString());
  }

  @Get('get/:commentId')
  @UseGuards(AuthGuard)
  GetComment(
    @CurrentUser() user: HydratedUser,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.getComment(commentId, user._id.toString());
  }

  @Patch('update/:commentId')
  @UseGuards(AuthGuard)
  UpdateComment(
    @CurrentUser() user: HydratedUser,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      commentId,
      user._id.toString(),
      body,
    );
  }

  @Delete('delete/:commentId')
  @UseGuards(AuthGuard)
  DeleteComment(
    @CurrentUser() user: HydratedUser,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteComment(commentId, user._id.toString());
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepo } from 'src/Repo/user.repo';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { PostRepo } from 'src/Repo/post.repo';
import { CommentRepo } from 'src/Repo/comment.repo';
import { PostService } from '../post/post.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Types } from 'mongoose';
import { PostCommentedEvent } from 'src/common/events/post-commented.event';
import { Comment } from 'src/models/comment.model';

@Injectable()
export class CommentService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly postRepo: PostRepo,
    private readonly CommentRepo: CommentRepo,
    private readonly postService: PostService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createComment(postId: string, userId: string, body: CreateCommentDto) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const post = await this.postRepo.findOne({
      filter: {
        _id: postId,
        deletedAt: null,
      },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    await this.postService.assertCanViewPost(post, userId);

    let parentComment: Comment | null = null;
    if (body.parentId) {
      parentComment = await this.CommentRepo.findOne({
        filter: { _id: body.parentId, postId, deletedAt: null },
      });
      if (!parentComment) {
        throw new BadRequestException('can not find parent comment');
      }
    }
    const comment = await this.CommentRepo.create({
      data: {
        postId,
        createdBy: userId,
        content: body.content,
        parentId: body.parentId ?? null,
      },
    });
    const actorId = new Types.ObjectId(userId);
    const postObjectId = new Types.ObjectId(postId);
    if (post.createdBy.toString() !== userId.toString()) {
      this.eventEmitter.emit(
        'post.commented',
        new PostCommentedEvent(
          actorId,
          postObjectId,
          comment._id,
          post.createdBy,
        ),
      );
    }
    if (
      parentComment &&
      parentComment.createdBy.toString() !== userId.toString() &&
      parentComment.createdBy.toString() !== post.createdBy.toString()
    ) {
      this.eventEmitter.emit(
        'post.commented',
        new PostCommentedEvent(
          actorId,
          postObjectId,
          comment._id,
          parentComment.createdBy,
        ),
      );
    }
    return comment;
  }
  async getPostComments(postId: string, userId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const post = await this.postRepo.findOne({
      filter: {
        _id: postId,
        deletedAt: null,
      },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    await this.postService.assertCanViewPost(post, userId);
    const comment = await this.CommentRepo.findAll({
      filter: { postId, deletedAt: null },
      projection: '-deletedAt',
      options: {
        populate: [
          {
            path: 'createdBy',
            select: 'userName profilePicture',
          },
        ],
      },
    });
    return comment;
  }
  async getComment(commentId: string, userId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const comment = await this.CommentRepo.findOne({
      filter: { _id: commentId, deletedAt: null },
      options: {
        populate: [
          {
            path: 'createdBy',
            select: 'userName profilePicture',
          },
        ],
      },
    });
    if (!comment) {
      throw new NotFoundException('comment does not exist');
    }
    const post = await this.postRepo.findOne({
      filter: {
        _id: comment.postId,
        deletedAt: null,
      },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    await this.postService.assertCanViewPost(post, userId);
    return comment;
  }
  async updateComment(
    commentId: string,
    userId: string,
    body: UpdateCommentDto,
  ) {
    const updatedComment = await this.CommentRepo.findOneAndUpdate({
      filter: { _id: commentId, createdBy: userId, deletedAt: null },
      update: { ...body },
      options: { new: true },
    });
    return updatedComment;
  }
  async deleteComment(commentId: string, userId: string) {
    await this.CommentRepo.findOneAndUpdate({
      filter: { _id: commentId, createdBy: userId, deletedAt: null },
      update: { deletedAt: new Date() },
    });
  }
}

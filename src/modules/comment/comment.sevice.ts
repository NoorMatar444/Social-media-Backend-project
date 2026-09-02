import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepo } from 'src/Repo/user.repo';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { PostRepo } from 'src/Repo/post.repo';
import { PrivacyEnum } from 'src/common/enums/post.enum';
import { CommentRepo } from 'src/Repo/comment.repo';

@Injectable()
export class CommentService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly postRepo: PostRepo,
    private readonly CommentRepo: CommentRepo,
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
    if (post.privacy !== PrivacyEnum.PUBLIC) {
      throw new ForbiddenException('can not create comment');
    }
    if (body.parentId) {
      await this.CommentRepo.findOne({
        filter: { _id: body.parentId, postId, deletedAt: null },
      });
    } else {
      throw new BadRequestException('can not find parent comment');
    }
    const comment = await this.CommentRepo.create({
      data: {
        postId,
        createdBy: userId,
        content: body.content,
        parentId: body.parentId ?? null,
      },
    });
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
    if (post.privacy !== PrivacyEnum.PUBLIC) {
      throw new ForbiddenException('can not create comment');
    }
    const comment = await this.CommentRepo.findAll({
      filter: { postId, deletedAt: null },
      projection: '-deletedAt',
      options: {
        populate: [
          {
            path: 'createdBy',
          },
          {
            path: 'userName profilePicture',
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
    const comment = await this.CommentRepo.findAll({
      filter: { _id: commentId, deletedAt: null },
      options: {
        populate: [
          {
            path: 'createdBy',
          },
          {
            path: 'userName profilePicture',
          },
        ],
      },
    });
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

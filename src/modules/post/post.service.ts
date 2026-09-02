import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { HydratedUser } from 'src/models/user.model';
import { Post } from 'src/models/post.model';
import { PostRepo } from 'src/Repo/post.repo';
import { UserRepo } from 'src/Repo/user.repo';
import { PrivacyEnum } from 'src/common/enums/post.enum';
import { S3BucketService } from '../../common/services/s3Bucket.service';
import { StorageApproachEnum } from 'src/common/enums/multer.enum';
import { FollowService } from '../follow/follow.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepo,
    private readonly userRepo: UserRepo,
    private readonly S3BucketService: S3BucketService,
    private readonly followService: FollowService,
  ) {}
  async assertCanViewPost(post: Post, viewerId: string) {
    const isOwner = post.createdBy.toString() === viewerId.toString();
    if (isOwner) {
      return;
    }
    if (post.privacy === PrivacyEnum.PUBLIC) {
      return;
    }
    if (post.privacy === PrivacyEnum.FRIENDS) {
      const { following } = await this.followService.isFollowing(
        viewerId,
        post.createdBy.toString(),
      );
      if (following) {
        return;
      }
    }
    throw new ForbiddenException('you can not view this post');
  }
  async createPost(
    body: CreatePostDto,
    user: HydratedUser,
    files: Express.Multer.File[],
  ) {
    const hasContent =
      typeof body.content === 'string' && body.content.trim().length > 0;
    if (!hasContent && !files?.length) {
      throw new BadRequestException(
        'Post must have content or at least one attachment',
      );
    }
    const keys = files?.length
      ? (
          await this.S3BucketService.uploadFiles({
            files,
            path: '/post',
            storageApproach: StorageApproachEnum.MEMORY,
          })
        ).filter((key): key is string => Boolean(key))
      : [];
    const post = await this.postRepo.create({
      data: {
        ...body,
        createdBy: user._id,
        attachments: keys,
      },
    });
    return post;
  }
  async getPost(postId: string, userId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const post = await this.postRepo.findOne({
      filter: { _id: postId, deletedAt: null },
      projection: '-deletedAt',
      options: {
        populate: [
          {
            path: 'tags',
          },
        ],
      },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    await this.assertCanViewPost(post, userId);
    return post;
  }
  async getUserPosts(userId: string, viewerId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const isOwner = userId === viewerId;
    const { following } = await this.followService.isFollowing(
      viewerId,
      userId,
    );
    const posts = await this.postRepo.findAll({
      filter: isOwner
        ? { createdBy: userId, deletedAt: null }
        : following
          ? {
              createdBy: userId,
              deletedAt: null,
              privacy: { $in: [PrivacyEnum.PUBLIC, PrivacyEnum.FRIENDS] },
            }
          : { createdBy: userId, deletedAt: null, privacy: PrivacyEnum.PUBLIC },
    });
    return posts;
  }
  async updatePost(body: UpdatePostDto, userId: string, postId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const updatedPost = await this.postRepo.findOneAndUpdate({
      filter: { _id: postId, createdBy: userId, deletedAt: null },
      update: { ...body },
      options: { new: true },
    });
    if (!updatedPost) {
      throw new NotFoundException('post does not exist');
    }
    return updatedPost;
  }
  async deletePost(postID: string, userId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const post = await this.postRepo.findOneAndUpdate({
      filter: { _id: postID, createdBy: userId, deletedAt: null },
      update: { deletedAt: new Date() },
      options: { new: true },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    return post;
  }
  async likePost(userId: string, postId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const post = await this.postRepo.findOne({
      filter: { _id: postId, deletedAt: null },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    await this.assertCanViewPost(post, userId);
    const likes = await this.postRepo.findOneAndUpdate({
      filter: { _id: postId, deletedAt: null },
      update: { $addToSet: { likes: userId } },
      options: { new: true },
    });
    if (!likes) {
      throw new NotFoundException('post does not exist');
    }
    return likes;
  }
  async unlikePost(userId: string, postId: string) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    const post = await this.postRepo.findOne({
      filter: { _id: postId, deletedAt: null },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    await this.assertCanViewPost(post, userId);
    const unlikePost = await this.postRepo.findOneAndUpdate({
      filter: { _id: postId, deletedAt: null },
      update: { $pull: { likes: userId } },
      options: { new: true },
    });
    if (!unlikePost) {
      throw new NotFoundException('post does not exist');
    }
    return unlikePost;
  }
  async addAttachments(
    userId: string,
    files: Express.Multer.File[],
    postId: string,
  ) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    if (!files?.length) {
      throw new BadRequestException('files does not exist');
    }
    const post = await this.postRepo.findOne({
      filter: { _id: postId, createdBy: userId, deletedAt: null },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    const keys = (
      await this.S3BucketService.uploadFiles({
        files,
        path: '/post',
        storageApproach: StorageApproachEnum.MEMORY,
      })
    ).filter((key): key is string => Boolean(key));
    await this.postRepo.findOneAndUpdate({
      filter: { _id: postId, createdBy: userId, deletedAt: null },
      update: { $push: { attachments: { $each: keys } } },
      options: { new: true },
    });
    return 'attachment added successfully';
  }
  async removeAttachments(
    userId: string,
    attachmentKey: string[],
    postId: string,
  ) {
    if (!(await this.userRepo.findById({ id: userId }))) {
      throw new NotFoundException('user does not exist');
    }
    if (!attachmentKey?.length) {
      throw new BadRequestException('please select an attachment');
    }
    const post = await this.postRepo.findOne({
      filter: { _id: postId, createdBy: userId, deletedAt: null },
    });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    const ownedKeys = attachmentKey.filter((key) =>
      post.attachments.includes(key),
    );
    if (!ownedKeys.length) {
      throw new BadRequestException('attachment does not belong to post');
    }
    await this.S3BucketService.deleteFiles(ownedKeys);
    await this.postRepo.findOneAndUpdate({
      filter: { _id: postId, createdBy: userId, deletedAt: null },
      update: { $pull: { attachments: { $in: ownedKeys } } },
    });
    return 'attachment deleted successfully';
  }
  async getHomeFeed(viewerId: string, page: number, limit: number) {
    if (!(await this.userRepo.findById({ id: viewerId }))) {
      throw new NotFoundException('user does not exist');
    }
    if (page < 1) {
      page = 1;
    }
    if (limit < 1) {
      limit = 20;
    }
    const followingIds = await this.followService.getFollowingIds(viewerId);
    const homeFeed = await this.postRepo.findAll({
      filter: {
        deletedAt: null,
        $or: [
          { createdBy: viewerId },
          {
            createdBy: { $in: followingIds },
            privacy: { $in: [PrivacyEnum.PUBLIC, PrivacyEnum.FRIENDS] },
          },
        ],
      },
      options: {
        sort: { createdAt: -1 },
        skip: (page - 1) * limit,
        limit,
      },
    });
    return homeFeed;
  }
}

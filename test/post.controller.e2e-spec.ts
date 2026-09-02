import {
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AuthGuard } from '../src/Security/Guards/authentication.guard';
import { TokenService } from '../src/common/services/token.service';
import { PostController } from '../src/modules/post/post.controller';
import { PostService } from '../src/modules/post/post.service';

const userId = '64b7f2c1a1b2c3d4e5f60789';
const postId = '64b7f2c1a1b2c3d4e5f60790';
const fakeUser = { _id: { toString: () => userId } };

describe('PostController (e2e)', () => {
  let app: INestApplication;
  const postService = {
    createPost: jest.fn(),
    getUserPosts: jest.fn(),
    getPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    addAttachments: jest.fn(),
    removeAttachments: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: PostService, useValue: postService },
        { provide: TokenService, useValue: { checkToken: jest.fn() } },
        AuthGuard,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: {
          switchToHttp: () => { getRequest: () => Record<string, unknown> };
        }) => {
          const req = context.switchToHttp().getRequest();
          req.user = fakeUser;
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /posts calls createPost', async () => {
    postService.createPost.mockResolvedValue({ content: 'hello' });
    await request(app.getHttpServer())
      .post('/posts')
      .field('content', 'hello')
      .expect(201)
      .expect({ content: 'hello' });
    expect(postService.createPost).toHaveBeenCalledWith(
      { content: 'hello' },
      fakeUser,
      expect.any(Array),
    );
  });

  it('POST /posts rejects invalid privacy', async () => {
    await request(app.getHttpServer())
      .post('/posts')
      .send({ content: 'hello', privacy: 'everyone' })
      .expect(400);
    expect(postService.createPost).not.toHaveBeenCalled();
  });

  it('GET /posts/user/:userId calls getUserPosts', async () => {
    postService.getUserPosts.mockResolvedValue([]);
    await request(app.getHttpServer())
      .get(`/posts/user/${userId}`)
      .expect(200);
    expect(postService.getUserPosts).toHaveBeenCalledWith(userId, userId);
  });

  it('GET /posts/get/:postId calls getPost', async () => {
    postService.getPost.mockResolvedValue({ content: 'hello' });
    await request(app.getHttpServer()).get(`/posts/get/${postId}`).expect(200);
    expect(postService.getPost).toHaveBeenCalledWith(postId, userId);
  });

  it('PATCH /posts/update/:postId calls updatePost', async () => {
    postService.updatePost.mockResolvedValue({ content: 'updated' });
    await request(app.getHttpServer())
      .patch(`/posts/update/${postId}`)
      .send({ content: 'updated' })
      .expect(200);
    expect(postService.updatePost).toHaveBeenCalledWith(
      { content: 'updated' },
      userId,
      postId,
    );
  });

  it('DELETE /posts/delete/:postId calls deletePost', async () => {
    postService.deletePost.mockResolvedValue({ deletedAt: new Date() });
    await request(app.getHttpServer())
      .delete(`/posts/delete/${postId}`)
      .expect(200);
    expect(postService.deletePost).toHaveBeenCalledWith(postId, userId);
  });

  it('PATCH /posts/:postId/like calls likePost', async () => {
    postService.likePost.mockResolvedValue({ likes: [userId] });
    await request(app.getHttpServer())
      .patch(`/posts/${postId}/like`)
      .expect(200);
    expect(postService.likePost).toHaveBeenCalledWith(userId, postId);
  });

  it('PATCH /posts/:postId/unlike calls unlikePost', async () => {
    postService.unlikePost.mockResolvedValue({ likes: [] });
    await request(app.getHttpServer())
      .patch(`/posts/${postId}/unlike`)
      .expect(200);
    expect(postService.unlikePost).toHaveBeenCalledWith(userId, postId);
  });

  it('POST /posts/:postId/attachments calls addAttachments', async () => {
    postService.addAttachments.mockResolvedValue(
      'attachment added successfully',
    );
    await request(app.getHttpServer())
      .post(`/posts/${postId}/attachments`)
      .attach('files', Buffer.from('img'), {
        filename: 'a.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);
    expect(postService.addAttachments).toHaveBeenCalledWith(
      userId,
      expect.arrayContaining([
        expect.objectContaining({ originalname: 'a.jpg' }),
      ]),
      postId,
    );
  });

  it('DELETE /posts/:postId/attachments calls removeAttachments', async () => {
    postService.removeAttachments.mockResolvedValue(
      'attachment deleted successfully',
    );
    await request(app.getHttpServer())
      .delete(`/posts/${postId}/attachments`)
      .send({ attachmentKey: ['post-key'] })
      .expect(200);
    expect(postService.removeAttachments).toHaveBeenCalledWith(
      userId,
      ['post-key'],
      postId,
    );
  });
});

describe('PostController auth guard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: { getPost: jest.fn() },
        },
        {
          provide: TokenService,
          useValue: {
            checkToken: jest
              .fn()
              .mockRejectedValue(new UnauthorizedException('token not valid')),
          },
        },
        AuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /posts/get/:postId without a token returns 401', async () => {
    await request(app.getHttpServer()).get(`/posts/get/${postId}`).expect(401);
  });
});

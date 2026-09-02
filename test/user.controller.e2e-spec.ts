import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AuthGuard } from '../src/Security/Guards/authentication.guard';
import { TokenService } from '../src/common/services/token.service';
import { UserController } from '../src/modules/user/user.controller';
import { UserService } from '../src/modules/user/user.service';

const userId = '64b7f2c1a1b2c3d4e5f60789';
const fakeUser = { _id: { toString: () => userId } };

describe('UserController (e2e)', () => {
  let app: INestApplication;
  const userService = {
    getMyProfile: jest.fn(),
    updateProfile: jest.fn(),
    updatePhone: jest.fn(),
    changePassword: jest.fn(),
    uploadProfilePicture: jest.fn(),
    removeProfilePicture: jest.fn(),
    uploadCoverPictures: jest.fn(),
    removeCoverPicture: jest.fn(),
    deactivateAccount: jest.fn(),
    deleteAccount: jest.fn(),
    getPublicProfile: jest.fn(),
    getUserByUserName: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userService },
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

  it('GET /users/me calls getMyProfile', async () => {
    userService.getMyProfile.mockResolvedValue({ userName: 'noor' });
    await request(app.getHttpServer())
      .get('/users/me')
      .expect(200)
      .expect({ userName: 'noor' });
    expect(userService.getMyProfile).toHaveBeenCalledWith(userId);
  });

  it('PATCH /users/me/update-profile rejects invalid userName', async () => {
    await request(app.getHttpServer())
      .patch('/users/me/update-profile')
      .send({ userName: 'a b' })
      .expect(400);
    expect(userService.updateProfile).not.toHaveBeenCalled();
  });

  it('PATCH /users/me/update-profile calls updateProfile', async () => {
    userService.updateProfile.mockResolvedValue({ userName: 'noor_2' });
    await request(app.getHttpServer())
      .patch('/users/me/update-profile')
      .send({ userName: 'noor_2', gender: 'female' })
      .expect(200)
      .expect({ userName: 'noor_2' });
    expect(userService.updateProfile).toHaveBeenCalledWith(userId, {
      userName: 'noor_2',
      gender: 'female',
    });
  });

  it('PATCH /users/me/phone calls updatePhone', async () => {
    userService.updatePhone.mockResolvedValue({ phone: 'encrypted' });
    await request(app.getHttpServer())
      .patch('/users/me/phone')
      .send({ phone: '0501234567' })
      .expect(200);
    expect(userService.updatePhone).toHaveBeenCalledWith(userId, '0501234567');
  });

  it('PATCH /users/me/password rejects a short new password', async () => {
    await request(app.getHttpServer())
      .patch('/users/me/password')
      .send({ oldPassword: 'oldpass12', newPassword: 'short' })
      .expect(400);
    expect(userService.changePassword).not.toHaveBeenCalled();
  });

  it('PATCH /users/me/password calls changePassword', async () => {
    userService.changePassword.mockResolvedValue({ message: 'ok' });
    await request(app.getHttpServer())
      .patch('/users/me/password')
      .send({ oldPassword: 'oldpass12', newPassword: 'newpass12' })
      .expect(200);
    expect(userService.changePassword).toHaveBeenCalledWith(userId, {
      oldPassword: 'oldpass12',
      newPassword: 'newpass12',
    });
  });

  it('POST /users/me/profile-picture calls uploadProfilePicture', async () => {
    userService.uploadProfilePicture.mockResolvedValue({ profilePicture: 'key' });
    await request(app.getHttpServer())
      .post('/users/me/profile-picture')
      .attach('file', Buffer.from('fake-image'), {
        filename: 'avatar.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);
    expect(userService.uploadProfilePicture).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ originalname: 'avatar.jpg' }),
    );
  });

  it('DELETE /users/me/profile-picture calls removeProfilePicture', async () => {
    userService.removeProfilePicture.mockResolvedValue(
      'profilePicture deleted successfully',
    );
    await request(app.getHttpServer())
      .delete('/users/me/profile-picture')
      .expect(200);
    expect(userService.removeProfilePicture).toHaveBeenCalledWith(userId);
  });

  it('POST /users/me/cover-pictures calls uploadCoverPictures', async () => {
    userService.uploadCoverPictures.mockResolvedValue({ coverPicture: ['k1'] });
    await request(app.getHttpServer())
      .post('/users/me/cover-pictures')
      .attach('files', Buffer.from('cover-1'), {
        filename: 'c1.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);
    expect(userService.uploadCoverPictures).toHaveBeenCalledWith(
      userId,
      expect.arrayContaining([
        expect.objectContaining({ originalname: 'c1.jpg' }),
      ]),
    );
  });

  it('DELETE /users/me/cover-pictures calls removeCoverPicture', async () => {
    userService.removeCoverPicture.mockResolvedValue(
      'CoverPicture deleted successfully',
    );
    await request(app.getHttpServer())
      .delete('/users/me/cover-pictures')
      .send({ pictureKey: ['cover-key'] })
      .expect(200);
    expect(userService.removeCoverPicture).toHaveBeenCalledWith(userId, [
      'cover-key',
    ]);
  });

  it('PATCH /users/me/deactivate calls deactivateAccount', async () => {
    userService.deactivateAccount.mockResolvedValue({
      message: 'account deactivated successfully',
    });
    await request(app.getHttpServer()).patch('/users/me/deactivate').expect(200);
    expect(userService.deactivateAccount).toHaveBeenCalledWith(userId);
  });

  it('DELETE /users/me calls deleteAccount', async () => {
    userService.deleteAccount.mockResolvedValue({
      message: 'account deleted successfully',
    });
    await request(app.getHttpServer())
      .delete('/users/me')
      .send({ password: 'TestPass12' })
      .expect(200);
    expect(userService.deleteAccount).toHaveBeenCalledWith(userId, 'TestPass12');
  });

  it('GET /users/id/:id calls getPublicProfile', async () => {
    userService.getPublicProfile.mockResolvedValue({ userName: 'noor' });
    await request(app.getHttpServer())
      .get(`/users/id/${userId}`)
      .expect(200);
    expect(userService.getPublicProfile).toHaveBeenCalledWith(userId);
  });

  it('GET /users/:userName calls getUserByUserName', async () => {
    userService.getUserByUserName.mockResolvedValue({ userName: 'noor' });
    await request(app.getHttpServer()).get('/users/noor').expect(200);
    expect(userService.getUserByUserName).toHaveBeenCalledWith('noor');
  });
});

describe('UserController auth guard (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: { getMyProfile: jest.fn() },
        },
        {
          provide: TokenService,
          useValue: {
            checkToken: jest.fn().mockRejectedValue(
              new UnauthorizedException('token not valid'),
            ),
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

  it('GET /users/me without a token returns 401', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
  });
});

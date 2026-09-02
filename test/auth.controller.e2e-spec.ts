import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AuthGuard } from '../src/Security/Guards/authentication.guard';
import { TokenService } from '../src/common/services/token.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { GoogleOAuthGuard } from '../src/modules/auth/guard/google-oauth.guard';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authService = {
    Signup: jest.fn(),
    login: jest.fn(),
    confirmEmail: jest.fn(),
    resendConfirmEmailOtp: jest.fn(),
    sendForgetPasswordOtp: jest.fn(),
    forgetPassword: jest.fn(),
    logout: jest.fn(),
    googleAuth: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
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
          req.tokenPayload = { sub: 'user-id', jti: 'token-id' };
          return true;
        },
      })
      .overrideGuard(GoogleOAuthGuard)
      .useValue({ canActivate: () => true })
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

  it('POST /auth/signup rejects invalid body', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'bad' })
      .expect(400);
    expect(authService.Signup).not.toHaveBeenCalled();
  });

  it('POST /auth/signup calls Signup', async () => {
    authService.Signup.mockResolvedValue({ email: 'a@b.com' });
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        userName: 'noor_1',
        email: 'a@b.com',
        password: 'password12',
      })
      .expect(201);
    expect(authService.Signup).toHaveBeenCalledWith({
      userName: 'noor_1',
      email: 'a@b.com',
      password: 'password12',
    });
  });

  it('POST /auth/login rejects missing password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'a@b.com' })
      .expect(400);
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('POST /auth/login calls login', async () => {
    authService.login.mockResolvedValue({
      access_token: 'a',
      refresh_token: 'r',
    });
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'a@b.com', password: 'password12' })
      .expect(201)
      .expect({ access_token: 'a', refresh_token: 'r' });
    expect(authService.login).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'password12',
    });
  });

  it('POST /auth/confirmEmail rejects a non-6-digit otp', async () => {
    await request(app.getHttpServer())
      .post('/auth/confirmEmail')
      .send({ email: 'a@b.com', otp: '12' })
      .expect(400);
    expect(authService.confirmEmail).not.toHaveBeenCalled();
  });

  it('POST /auth/confirmEmail calls confirmEmail', async () => {
    authService.confirmEmail.mockResolvedValue({
      message: 'Email confirmed successfully',
    });
    await request(app.getHttpServer())
      .post('/auth/confirmEmail')
      .send({ email: 'a@b.com', otp: '123456' })
      .expect(201);
    expect(authService.confirmEmail).toHaveBeenCalledWith({
      email: 'a@b.com',
      otp: '123456',
    });
  });

  it('POST /auth/resend-confirmEmail calls resendConfirmEmailOtp', async () => {
    authService.resendConfirmEmailOtp.mockResolvedValue(undefined);
    await request(app.getHttpServer())
      .post('/auth/resend-confirmEmail')
      .send({ email: 'a@b.com' })
      .expect(201);
    expect(authService.resendConfirmEmailOtp).toHaveBeenCalledWith({
      email: 'a@b.com',
    });
  });

  it('POST /auth/send-forget-password-otp calls sendForgetPasswordOtp', async () => {
    authService.sendForgetPasswordOtp.mockResolvedValue(undefined);
    await request(app.getHttpServer())
      .post('/auth/send-forget-password-otp')
      .send({ email: 'a@b.com' })
      .expect(201);
    expect(authService.sendForgetPasswordOtp).toHaveBeenCalledWith({
      email: 'a@b.com',
    });
  });

  it('POST /auth/forget-password calls forgetPassword', async () => {
    authService.forgetPassword.mockResolvedValue({
      message: 'password updated successfully',
    });
    await request(app.getHttpServer())
      .post('/auth/forget-password')
      .send({ email: 'a@b.com', otp: '123456', password: 'newpass12' })
      .expect(201);
    expect(authService.forgetPassword).toHaveBeenCalledWith({
      email: 'a@b.com',
      otp: '123456',
      password: 'newpass12',
    });
  });

  it('POST /auth/logout calls logout with token payload', async () => {
    authService.logout.mockResolvedValue({ message: 'logged out successfully' });
    await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(201)
      .expect({ message: 'logged out successfully' });
    expect(authService.logout).toHaveBeenCalledWith({
      sub: 'user-id',
      jti: 'token-id',
    });
  });
});

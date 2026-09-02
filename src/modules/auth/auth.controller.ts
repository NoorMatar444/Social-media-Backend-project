import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ConfirmEmailDto,
  ForgetPasswordDto,
  LoginDto,
  ResendConfirmEmailOtp,
  SendForgetPasswordOtpDto,
  SignUpDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { GoogleProfileUser } from './strategy/google.strategy';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';
import type { IAuthRequest } from 'src/common/interfaces/request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthCallback(@Req() req: { user: GoogleProfileUser }) {
    return this.authService.googleAuth(req.user);
  }

  @Post('signup')
  async SignUp(@Body() body: SignUpDto) {
    return this.authService.Signup(body);
  }

  @Post('login')
  async Login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('confirmEmail')
  async ConfirmEmail(@Body() body: ConfirmEmailDto) {
    return this.authService.confirmEmail(body);
  }

  @Post('resend-confirmEmail')
  async ResendConfirmEmailOtp(@Body() body: ResendConfirmEmailOtp) {
    return this.authService.resendConfirmEmailOtp(body);
  }

  @Post('send-forget-password-otp')
  async SendForgetPasswordOtp(@Body() body: SendForgetPasswordOtpDto) {
    return this.authService.sendForgetPasswordOtp(body);
  }

  @Post('forget-password')
  async ForgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async Logout(@Req() req: IAuthRequest) {
    return this.authService.logout(req.tokenPayload);
  }
}

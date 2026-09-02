import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/common/services/Redis/redis.module';
import { SecurityModule } from 'src/Security/security.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from 'src/common/services/token.service';
import { EmailService } from 'src/common/services/Email.services';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/models/user.model';
import { UserRepo } from 'src/Repo/user.repo';
import { GoogleStrategy } from './strategy/google.strategy';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { AuthGuard } from 'src/Security/Guards/authentication.guard';

@Module({
  imports: [
    UserModule,
    RedisModule,
    SecurityModule,
    PassportModule.register({ session: false }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
  ],
  providers: [
    AuthService,
    TokenService,
    EmailService,
    UserRepo,
    GoogleStrategy,
    GoogleOAuthGuard,
    AuthGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { HydratedUser } from 'src/models/user.model';
import { UserRepo } from '../../Repo/user.repo';
import { RedisService } from './Redis/redis.service';
import { TokenEnum } from '../enums/token.enum';
import { RoleEnum } from '../enums/user.enum';

interface ITokenPayload {
  sub: string;
  role: RoleEnum;
  aud?: string | string[];
  iat?: number;
  exp?: number;
  jti?: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly ConfigService: ConfigService,
    private readonly UserRepo: UserRepo,
    private readonly RedisService: RedisService,
  ) {}
  getSecret(role: RoleEnum = RoleEnum.USER) {
    let access_secret: string | undefined;
    let refresh_secret: string | undefined;
    switch (role) {
      case RoleEnum.USER:
        access_secret = this.ConfigService.get<string>(
          'ACCESS_TOKEN_SECRET_USER',
        );
        refresh_secret = this.ConfigService.get<string>(
          'REFRESH_TOKEN_SECRET_USER',
        );
        break;

      case RoleEnum.ADMIN:
        access_secret = this.ConfigService.get<string>(
          'ACCESS_TOKEN_SECRET_ADMIN',
        );
        refresh_secret = this.ConfigService.get<string>(
          'REFRESH_TOKEN_SECRET_ADMIN',
        );
        break;

      default:
        break;
    }
    return { access_secret, refresh_secret };
  }
  getToken({
    payload,
    signature,
    options = {},
  }: {
    payload: object;
    signature: string | undefined;
    options?: JwtSignOptions;
  }): string {
    return jwt.sign(payload, signature as string, options);
  }
  decodedToken({
    token,
    options,
  }: {
    token: string;
    options?: jwt.DecodeOptions;
  }): ITokenPayload | null {
    return jwt.decode(token, options) as ITokenPayload | null;
  }
  verifyToken({
    token,
    signature,
    options,
  }: {
    token: string;
    signature: string;
    options?: JwtVerifyOptions;
  }): ITokenPayload {
    return jwt.verify(token, signature, options) as ITokenPayload;
  }
  generateAccessAndRefreshTokens(role: RoleEnum, user: HydratedUser) {
    const { access_secret, refresh_secret } = this.getSecret(role);
    const generateJwtid = randomUUID();
    const access_token = this.getToken({
      payload: { sub: user._id.toString(), role: user.role },
      signature: access_secret,
      options: {
        audience: [TokenEnum.ACCESS, String(user.role)],
        expiresIn: '1d',
        jwtid: generateJwtid,
      },
    });
    const refresh_token = this.getToken({
      payload: { sub: user._id.toString(), role: user.role },
      signature: refresh_secret,
      options: {
        audience: [TokenEnum.REFRESH, String(user.role)],
        expiresIn: '1y',
        jwtid: generateJwtid,
      },
    });
    return { access_token, refresh_token };
  }

  async checkToken(
    token: string,
    tokenTypeParam: TokenEnum = TokenEnum.ACCESS,
  ) {
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('token not valid');
    }
    const decodedToke = this.decodedToken({ token });
    if (!decodedToke) {
      throw new UnauthorizedException('token is not valid');
    }
    const userRole = decodedToke.role;
    if (userRole !== RoleEnum.ADMIN && userRole !== RoleEnum.USER) {
      throw new UnauthorizedException('userRole is not valid');
    }
    const { access_secret, refresh_secret } = this.getSecret(userRole);

    const secret =
      tokenTypeParam === TokenEnum.ACCESS ? access_secret : refresh_secret;

    if (!secret) {
      throw new UnauthorizedException('Secret not configured');
    }

    const verifiedToken = this.verifyToken({ token, signature: secret });
    const tokenAudience = verifiedToken.aud;

    const audienceArray = Array.isArray(tokenAudience)
      ? tokenAudience
      : [tokenAudience];

    if (!audienceArray.includes(tokenTypeParam)) {
      throw new UnauthorizedException('Invalid token type');
    }

    if (!verifiedToken.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    if (verifiedToken.jti) {
      const blacklistKey = this.RedisService.getBlackListTokenKey({
        userId: verifiedToken.sub,
        tokenId: verifiedToken.jti,
      });
      const isBlacklisted = await this.RedisService.isRedisKeyExist({
        key: blacklistKey,
      });
      if (isBlacklisted) {
        throw new UnauthorizedException('Login again');
      }
    }

    const user = await this.UserRepo.findById({ id: verifiedToken.sub });

    if (!user) {
      throw new UnauthorizedException('User not found, signup again');
    }

    if (user.isActive === false) {
      throw new UnauthorizedException('this account is deactivated');
    }

    if (verifiedToken.iat && user.changeCreditTime) {
      const tokenIssuedAt = new Date(verifiedToken.iat * 1000);

      if (tokenIssuedAt < user.changeCreditTime) {
        throw new UnauthorizedException('Login again');
      }
    }

    return {
      user,
      verifiedToken,
    };
  }

  async blacklistToken({
    userId,
    tokenId,
    seconds = 365 * 24 * 60 * 60,
  }: {
    userId: string;
    tokenId: string;
    seconds?: number;
  }) {
    const key = this.RedisService.getBlackListTokenKey({ userId, tokenId });
    await this.RedisService.setRedisKey({ key, value: '1' });
    await this.RedisService.expireRedisKey({ key, seconds });
  }
}

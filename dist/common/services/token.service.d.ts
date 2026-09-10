import { ConfigService } from '@nestjs/config';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { HydratedUser } from "../../models/user.model";
import { UserRepo } from '../../Repo/user.repo';
import { RedisService } from './Redis/redis.service';
import { TokenEnum } from '../enums/token.enum';
import { RoleEnum } from '../enums/user.enum';
import { ITokenPayload } from '../interfaces/token.interface';
export declare class TokenService {
    private readonly ConfigService;
    private readonly UserRepo;
    private readonly RedisService;
    constructor(ConfigService: ConfigService, UserRepo: UserRepo, RedisService: RedisService);
    getSecret(role?: RoleEnum): {
        access_secret: string | undefined;
        refresh_secret: string | undefined;
    };
    getToken({ payload, signature, options, }: {
        payload: object;
        signature: string | undefined;
        options?: JwtSignOptions;
    }): string;
    decodedToken({ token, options, }: {
        token: string;
        options?: jwt.DecodeOptions;
    }): ITokenPayload | null;
    verifyToken({ token, signature, options, }: {
        token: string;
        signature: string;
        options?: JwtVerifyOptions;
    }): ITokenPayload;
    generateAccessAndRefreshTokens(role: RoleEnum, user: HydratedUser): {
        access_token: string;
        refresh_token: string;
    };
    checkToken(token: string, tokenTypeParam?: TokenEnum): Promise<{
        user: import("mongoose").Document<unknown, {}, import("src/models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("src/models/user.model").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        verifiedToken: ITokenPayload;
    }>;
}

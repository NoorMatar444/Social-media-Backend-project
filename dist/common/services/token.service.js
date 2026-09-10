"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const jwt = __importStar(require("jsonwebtoken"));
const user_repo_1 = require("../../Repo/user.repo");
const redis_service_1 = require("./Redis/redis.service");
const token_enum_1 = require("../enums/token.enum");
const user_enum_1 = require("../enums/user.enum");
let TokenService = class TokenService {
    ConfigService;
    UserRepo;
    RedisService;
    constructor(ConfigService, UserRepo, RedisService) {
        this.ConfigService = ConfigService;
        this.UserRepo = UserRepo;
        this.RedisService = RedisService;
    }
    getSecret(role = user_enum_1.RoleEnum.USER) {
        let access_secret;
        let refresh_secret;
        switch (role) {
            case user_enum_1.RoleEnum.USER:
                access_secret = this.ConfigService.get('ACCESS_TOKEN_SECRET_USER');
                refresh_secret = this.ConfigService.get('REFRESH_TOKEN_SECRET_USER');
                break;
            case user_enum_1.RoleEnum.ADMIN:
                access_secret = this.ConfigService.get('ACCESS_TOKEN_SECRET_ADMIN');
                refresh_secret = this.ConfigService.get('REFRESH_TOKEN_SECRET_ADMIN');
                break;
            default:
                break;
        }
        return { access_secret, refresh_secret };
    }
    getToken({ payload, signature, options = {}, }) {
        return jwt.sign(payload, signature, options);
    }
    decodedToken({ token, options, }) {
        return jwt.decode(token, options);
    }
    verifyToken({ token, signature, options, }) {
        return jwt.verify(token, signature, options);
    }
    generateAccessAndRefreshTokens(role, user) {
        const { access_secret, refresh_secret } = this.getSecret(role);
        const generateJwtid = (0, crypto_1.randomUUID)();
        const access_token = this.getToken({
            payload: { sub: user._id.toString(), role: user.role },
            signature: access_secret,
            options: {
                audience: [token_enum_1.TokenEnum.ACCESS, String(user.role)],
                expiresIn: '1d',
                jwtid: generateJwtid,
            },
        });
        const refresh_token = this.getToken({
            payload: { sub: user._id.toString(), role: user.role },
            signature: refresh_secret,
            options: {
                audience: [token_enum_1.TokenEnum.REFRESH, String(user.role)],
                expiresIn: '1y',
                jwtid: generateJwtid,
            },
        });
        return { access_token, refresh_token };
    }
    async checkToken(token, tokenTypeParam = token_enum_1.TokenEnum.ACCESS) {
        if (!token || typeof token !== 'string') {
            throw new common_1.UnauthorizedException('token not valid');
        }
        const decodedToke = this.decodedToken({ token });
        if (!decodedToke) {
            throw new common_1.UnauthorizedException('token is not valid');
        }
        const userRole = decodedToke.role;
        if (userRole !== user_enum_1.RoleEnum.ADMIN && userRole !== user_enum_1.RoleEnum.USER) {
            throw new common_1.UnauthorizedException('userRole is not valid');
        }
        const { access_secret, refresh_secret } = this.getSecret(userRole);
        const secret = tokenTypeParam === token_enum_1.TokenEnum.ACCESS ? access_secret : refresh_secret;
        if (!secret) {
            throw new common_1.UnauthorizedException('Secret not configured');
        }
        const verifiedToken = this.verifyToken({ token, signature: secret });
        const tokenAudience = verifiedToken.aud;
        const audienceArray = Array.isArray(tokenAudience)
            ? tokenAudience
            : [tokenAudience];
        if (!audienceArray.includes(tokenTypeParam)) {
            throw new common_1.UnauthorizedException('Invalid token type');
        }
        if (!verifiedToken.sub) {
            throw new common_1.UnauthorizedException('Invalid token payload');
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
                throw new common_1.UnauthorizedException('Login again');
            }
        }
        const user = await this.UserRepo.findById({ id: verifiedToken.sub });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found, signup again');
        }
        if (user.isActive === false) {
            throw new common_1.UnauthorizedException('this account is deactivated');
        }
        if (verifiedToken.iat && user.changeCreditTime) {
            const tokenIssuedAt = new Date(verifiedToken.iat * 1000);
            if (tokenIssuedAt < user.changeCreditTime) {
                throw new common_1.UnauthorizedException('Login again');
            }
        }
        return {
            user,
            verifiedToken,
        };
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        user_repo_1.UserRepo,
        redis_service_1.RedisService])
], TokenService);
//# sourceMappingURL=token.service.js.map
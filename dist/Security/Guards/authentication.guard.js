"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const token_enum_1 = require("../../common/enums/token.enum");
const token_service_1 = require("../../common/services/token.service");
let AuthGuard = class AuthGuard {
    TokenService;
    reflector;
    constructor(TokenService, reflector) {
        this.TokenService = TokenService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        let request;
        let authorization;
        request = context.switchToHttp().getRequest();
        authorization = request.headers.authorization;
        if (!authorization?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('token not valid');
        }
        const token = authorization.split(' ')[1];
        const tokenType = this.reflector.getAllAndOverride('tokenType', [
            context.getHandler(),
            context.getClass(),
        ]) ?? token_enum_1.TokenEnum.ACCESS;
        const { user, verifiedToken } = await this.TokenService.checkToken(token, tokenType);
        request.user = user;
        request.tokenPayload = verifiedToken;
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_service_1.TokenService,
        core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=authentication.guard.js.map
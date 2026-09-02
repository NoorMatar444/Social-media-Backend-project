import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from "../../common/services/token.service";
export declare class AuthGuard implements CanActivate {
    private readonly TokenService;
    private readonly reflector;
    constructor(TokenService: TokenService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

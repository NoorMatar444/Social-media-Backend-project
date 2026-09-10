import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenEnum } from 'src/common/enums/token.enum';
import { TokenService } from 'src/common/services/token.service';
import { IAuthRequest } from '../../common/interfaces/request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly TokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request!: IAuthRequest; // we use IAuthRequest because Express Request has no user or tokenPayload
    let authorization: string | undefined;
    request = context.switchToHttp().getRequest();
    authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('token not valid');
    }
    const token = authorization.split(' ')[1];
    const tokenType =
      this.reflector.getAllAndOverride<TokenEnum>('tokenType', [
        context.getHandler(),
        context.getClass(),
      ]) ?? TokenEnum.ACCESS;
    const { user, verifiedToken } = await this.TokenService.checkToken(
      token,
      tokenType,
    );
    request.user = user;
    request.tokenPayload = verifiedToken;
    return true;
  }
}

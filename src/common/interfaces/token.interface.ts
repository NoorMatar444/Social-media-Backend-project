import { RoleEnum } from '../enums/user.enum';

export interface ITokenPayload {
  sub: string;
  role: RoleEnum;
  aud?: string | string[];
  iat?: number;
  exp?: number;
  jti?: string;
}

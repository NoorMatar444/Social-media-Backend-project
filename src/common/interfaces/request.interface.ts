import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HydratedUser } from 'src/models/user.model';

export interface IAuthRequest extends Request {
  user: HydratedUser;
  tokenPayload: JwtPayload;
}

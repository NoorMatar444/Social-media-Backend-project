import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { HydratedUser, User } from 'src/models/user.model';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: HydratedUser }>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('user not found on request');
    }
    return data ? user[data] : user; // return one field or the whole user object =>  @currentUser('email) returns user.email, @currentUser() returns the whole user object
  },
);

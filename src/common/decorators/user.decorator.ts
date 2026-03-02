import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from 'src/interface/auth-request.interface';
import { TUserJwt } from 'src/types/user.types';

export const User = createParamDecorator(
  (data: keyof TUserJwt, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user[data] : user;
  },
);

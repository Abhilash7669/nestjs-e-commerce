import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { AuthRequest } from 'src/interface/auth-request.interface';
import { TUserJwt } from 'src/types/user.types';

export const User = createParamDecorator(
  (data: keyof TUserJwt, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);

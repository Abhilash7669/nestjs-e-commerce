import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { jwtConstants } from 'src/auth/constants/jwt.constants';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TUserJwt } from 'src/types/user.types';

export class OptionalGetCartAuthGuard extends AuthGuard {
  constructor(jwtService: JwtService) {
    super(jwtService);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) return true;

    try {
      const payload: TUserJwt = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
    return true;
  }
}

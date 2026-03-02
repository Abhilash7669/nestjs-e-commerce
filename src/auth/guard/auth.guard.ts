import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { jwtConstants } from 'src/auth/constants/jwt.constants';
import { TUserJwt } from 'src/types/user.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    /**
     * DI jwtService
     */
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get request
    // extract token
    // verify token
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload: TUserJwt = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

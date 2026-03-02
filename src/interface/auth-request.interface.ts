import { Request } from 'express';
import { TUserJwt } from 'src/types/user.types';

export interface AuthRequest extends Request {
  user: TUserJwt;
}

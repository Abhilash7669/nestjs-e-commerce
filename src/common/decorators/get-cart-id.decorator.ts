import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CART_CONSTANTS } from 'src/carts/constants/cart.constants';
import { AuthRequest } from 'src/interface/auth-request.interface';

export const GetCartId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    const cookies = request.cookies;
    return (cookies[CART_CONSTANTS.cartId] as string) || undefined;
  },
);

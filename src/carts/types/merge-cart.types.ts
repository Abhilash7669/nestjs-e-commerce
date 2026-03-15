import { IUpdateCart } from 'src/carts/interface/update-cart.interface';

export type TMergeCart = Required<Pick<IUpdateCart, 'userId'>> &
  Pick<IUpdateCart, 'cartId'>;

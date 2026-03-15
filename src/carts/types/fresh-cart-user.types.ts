import { UpdateCartDto } from 'src/carts/dto/update-cart.dto';

export type TFreshCartUser = Omit<UpdateCartDto, 'cartId' | 'userId'>;

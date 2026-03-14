import { Types } from 'mongoose';
import { ICartItem } from 'src/carts/interface/cart-item.interface';

export interface ICart {
  userId?: Types.ObjectId | undefined | null;
  items: Array<ICartItem>;
  totalPrice: number;
  totalQuantity: number;
}

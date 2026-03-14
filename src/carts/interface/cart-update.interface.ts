import { Types } from 'mongoose';
import { IPopulateCartItem } from 'src/carts/interface/populate-cart-item.interface';

export interface ICartUpdate {
  items: IPopulateCartItem[];
  productVariant: {
    _id: Types.ObjectId;
  };
  newQuantity: number;
}

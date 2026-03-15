import { Types } from 'mongoose';
import { IPopulateCartItem } from 'src/carts/interface/populate-cart-item.interface';
import { ProductVaraintsDiscountEnum } from 'src/product-variants/enum/product-variants-discount.enum';

export interface ICartUpdate {
  items: IPopulateCartItem[];
  productVariant: {
    _id: Types.ObjectId;
    price: number;
    discount?: {
      discountType: ProductVaraintsDiscountEnum;
      value: number;
    } | null;
  };
  newQuantity: number;
  discountedPrice: number;
}

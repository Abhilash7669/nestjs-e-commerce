import { Types } from 'mongoose';
import { ProductVaraintsDiscountEnum } from 'src/product-variants/enum/product-variants-discount.enum';
import { ProductDocument } from 'src/products/schemas/product.schema';

export interface IPopulateCartItem {
  productId: Types.ObjectId | ProductDocument;
  productVariantId: {
    _id: Types.ObjectId;
    price: number;
    discount?: {
      discountType: ProductVaraintsDiscountEnum;
      value: number;
    } | null;
  };
  quantity: number;
  discountedPrice: number;
}

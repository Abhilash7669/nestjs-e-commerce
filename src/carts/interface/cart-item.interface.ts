import { Types } from 'mongoose';
import { ProductVariantDocument } from 'src/product-variants/schema/product-variants.schema';
import { ProductDocument } from 'src/products/schemas/product.schema';

export interface ICartItem {
  productId: Types.ObjectId | ProductDocument;
  productVariantId: Types.ObjectId | ProductVariantDocument;
  quantity: number;
}

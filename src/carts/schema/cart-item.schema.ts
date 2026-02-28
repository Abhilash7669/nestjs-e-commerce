import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  ProductVariant,
  ProductVariantDocument,
} from 'src/product-variants/schema/product-variants.schema';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';

@Schema({
  _id: false,
})
export class CartItem {
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    index: true,
  })
  productId: Types.ObjectId | ProductDocument;

  @Prop({
    type: Types.ObjectId,
    ref: ProductVariant.name,
    index: true,
  })
  productVariantId: Types.ObjectId | ProductVariantDocument;

  @Prop({
    type: Number,
    default: 1,
  })
  quantity: number;
}

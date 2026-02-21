import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProductListingsEnum } from 'src/product-listings/enum/product-listings.enum';
import { Product } from 'src/products/schemas/product.schema';

export type ProductListingDocument = HydratedDocument<ProductListing>;

@Schema({ timestamps: true })
export class ProductListing {
  @Prop({
    type: Types.ObjectId,
    ref: Product.name,
    default: null,
    index: true,
  })
  productId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ProductListingsEnum,
    default: ProductListingsEnum.FEATURED,
    index: true,
  })
  type: ProductListingsEnum;

  @Prop({
    type: Number,
    default: 0,
    index: true,
  })
  priority: number;
}

export const ProductListingSchema =
  SchemaFactory.createForClass(ProductListing);

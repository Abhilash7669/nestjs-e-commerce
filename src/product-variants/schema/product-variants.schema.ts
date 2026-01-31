import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({
  timestamps: true,
})
export class ProductVariant {
  /**
   * Refers to Product Schema
   */
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Product.name,
    default: null,
    index: true,
  })
  productId: Product | null;

  /**
   * Sudo Zoho related fields
   */
  @Prop({
    type: String,
    required: [true, 'Zoho Item id is required'],
    index: true,
    unique: true,
  })
  zohoItemId: string;

  @Prop({
    type: String,
    required: [true, 'Product name is required'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Stock keeping price is required'],
    index: true,
    unique: true,
  })
  sku: string;

  @Prop({
    _id: false,
    type: {
      color: String,
      size: String,
    },
    required: [true, 'Attribute is required'],
    default: {
      color: 'BLACK',
      size: 'XL',
    },
  })
  attribute: {
    color: string;
    size: string;
  };

  @Prop({
    type: Number,
    required: [true, 'Price is required'],
    default: 100,
  })
  price: number;

  @Prop({
    type: Number,
    required: [true, 'Stock is required'],
    default: 1,
  })
  stock: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: [String],
    default: [],
  })
  images: Array<string>;

  /**
   * productId - reference - done
   * zohoItemId - maybe from zoho - done
   * sku - business key way to identify exact stock - done
   * attribute: {
   *    color
   *    size
   * } - done
   * price - done
   * stock - done
   * isActive - done
   * images - done
   */
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);

/**
 * COMPOUND INDEXES
 */
ProductVariantSchema.index(
  {
    productId: 1,
    isActive: 1,
    'attributes.color': 1,
    'attributes.size': 1,
  },
  { name: 'product_attributes_index' },
);

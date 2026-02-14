import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Collection, HydratedDocument, Types } from 'mongoose';
import { Category } from 'src/categories/schema/category.schema';
import { ProductGenderEnum } from 'src/products/enums/product-gender.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Slug is required'],
    trim: true,
    index: true,
  })
  slug: string;

  @Prop({
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
    required: [true, 'Category is required'],
    ref: Category.name,
  })
  category: Types.ObjectId;

  @Prop({
    type: Number,
    required: [true, 'Base Price is required'],
  })
  basePrice: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isManualNewOverride?: boolean;

  @Prop({
    type: Boolean,
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({
    type: [String],
  })
  images?: Array<string>;

  @Prop({
    type: String,
    trim: true,
  })
  previewImageUrl?: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Collection.name }],
    index: true,
    default: [],
  })
  collections: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ProductGenderEnum,
    default: ProductGenderEnum.WOMEN,
    index: true,
  })
  gender: ProductGenderEnum;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

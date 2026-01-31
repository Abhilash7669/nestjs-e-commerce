import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  })
  slug: string;

  @Prop({
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  })
  description: string;

  @Prop({
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  })
  category: string;

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
    type: [String],
  })
  collections?: Array<string>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

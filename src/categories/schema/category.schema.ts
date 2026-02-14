import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({
    type: String,
    required: [true, 'Name is required'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Slug is required'],
    index: true,
  })
  slug: string;

  @Prop({
    type: Boolean,
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  showInMenu: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ slug: 1, isActive: 1 }, { name: 'category_index' });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema({
  timestamps: true,
})
export class Collection {
  @Prop({
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
  })
  slug: string;

  @Prop({
    type: String,
    default: null,
  })
  description?: string | null;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: String,
    default: null,
  })
  previewImageUrl?: string | null;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

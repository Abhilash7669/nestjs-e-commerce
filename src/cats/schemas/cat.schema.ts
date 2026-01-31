import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop({
    type: String,
    required: [true, 'Name is required'],
  })
  name: string;

  @Prop({
    type: Number,
    required: [true, 'Age is required'],
  })
  age: number;

  @Prop({
    type: String,
    required: [true, 'Breed is required'],
  })
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);

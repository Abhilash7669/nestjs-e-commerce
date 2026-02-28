import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CartItem } from 'src/carts/schema/cart-item.schema';
import { User } from 'src/users/schemas/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    default: null,
  })
  userId?: Types.ObjectId;

  @Prop({
    type: [CartItem],
  })
  items: Array<CartItem>;

  @Prop({
    type: Number,
    default: 0,
  })
  totalPrice: number;

  @Prop({
    type: Number,
    default: 0,
  })
  totalQuantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index(
  {
    userId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      userId: { $type: 'objectId' },
    },
  },
);
CartSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600, partialFilterExpression: { userId: null } }, // TTL for cart without userId
);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { userRoles } from 'src/users/enums/users-role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    type: Number,
    required: true,
  })
  phone: number;

  @Prop({
    type: String,
    required: [true, 'Email is required'],
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Address is required'],
  })
  address: string;

  @Prop({
    type: String,
    enum: userRoles,
    default: userRoles.GUEST,
    required: [true, 'User Role is required'],
  })
  role: userRoles;

  // todo: add cart & purchase reference later
}

export const UserSchema = SchemaFactory.createForClass(User);

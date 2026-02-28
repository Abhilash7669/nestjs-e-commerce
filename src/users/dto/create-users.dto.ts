import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { userRoles } from 'src/users/enums/users-role.enum';

export class CreateUsersDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    name: 'name',
    default: 'Abhilash SK',
    example: 'Abhilash',
  })
  name?: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    name: 'phone',
    required: true,
    default: 9995410442,
  })
  phone: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    required: true,
    default: 'abhilashsk1998@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'address',
    required: true,
    default: 'Poojapura, Mudavanmugal, South Road',
  })
  address: string;

  @IsEnum(userRoles)
  @ApiProperty({
    name: 'role',
    enum: userRoles,
    default: userRoles.GUEST,
  })
  role: userRoles;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    name: 'cartId',
    example: null,
  })
  cartId?: Types.ObjectId | null;
}

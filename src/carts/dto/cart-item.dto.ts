import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'productId',
  })
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'productId',
  })
  productVariantId: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    name: 'quantity',
    example: 1,
  })
  quantity: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IUpdateCart } from 'src/carts/interface/update-cart.interface';

type Hello = {
  userId?: string;
};
export class UpdateCartDto implements Hello {
  @ApiPropertyOptional({
    name: 'userId',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    name: 'cartId',
  })
  @IsString()
  @IsOptional()
  cartId?: string;

  @ApiProperty({
    name: 'sku',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    name: 'quantity',
  })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

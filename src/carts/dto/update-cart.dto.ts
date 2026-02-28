import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCartDto {
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

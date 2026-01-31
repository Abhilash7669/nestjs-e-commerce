import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductVariantAttributeDto {
  @ApiProperty({
    name: 'color',
    description: 'Color of the item',
    example: 'Black',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    name: 'size',
    description: 'Size of the item',
    example: 'XL',
  })
  @IsString()
  @IsNotEmpty()
  size: string;
}

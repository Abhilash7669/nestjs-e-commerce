import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ProductListingsEnum } from 'src/product-listings/enum/product-listings.enum';

export class CreateProductListingsDto {
  @ApiProperty({
    name: 'productId',
    description: 'Unique id of the product',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @ApiProperty({
    name: 'type',
    description: 'Type of Listing of the product',
    type: 'string',
    enum: ProductListingsEnum,
    default: ProductListingsEnum.FEATURED,
  })
  @IsEnum(ProductListingsEnum)
  @IsNotEmpty()
  type: ProductListingsEnum;

  @ApiPropertyOptional({
    name: 'priority',
    description: 'Priority of the listing to sort',
    type: 'number',
    example: 0,
    default: 0,
  })
  @IsInt()
  priority?: number;
}

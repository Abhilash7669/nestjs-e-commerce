import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductVariantAttributeDto } from 'src/product-variants/dto/product-variant-attribute.dto';

export class CreateProductVariantsDto {
  @ApiPropertyOptional({
    name: 'productId',
    description: 'Id of the product',
  })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiProperty({
    name: 'zohoItemId',
    description: 'The Zoho Item Id',
    example: '981923jd9a',
  })
  @IsString()
  @IsNotEmpty()
  zohoItemId: string;

  @ApiProperty({
    name: 'name',
    description: 'Name of the zoho product',
    example: 'Black Saree',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'sku',
    description: 'Stock keeping unit in zoho',
    example: 'SKU-BLCK-DRESS-XL',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    name: 'attribute',
    description: 'attributes of the item',
    example: {
      color: 'Black',
      size: 'XL',
    },
  })
  @ValidateNested()
  @Type(() => ProductVariantAttributeDto) // Type cast it so nested validation works as expected
  attribute: ProductVariantAttributeDto;

  @ApiProperty({
    name: 'price',
    description: 'Base Price of the item',
    example: 200,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    name: 'stock',
    description: 'Shows the stock of the item',
    example: 500,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

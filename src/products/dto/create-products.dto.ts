import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductsDto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the product',
    example: 'Black Some Saree',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'description',
    description: 'Short description about the product',
    example: 'Hi this is a Saree',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    name: 'category',
    description: 'Category this product falls under',
    example: 'saree',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    name: 'basePrice',
    description: 'Base Price of the product',
    example: 899,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  basePrice: number;
}

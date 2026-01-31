import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateProductVariantsDto } from 'src/product-variants/dto/create-product-variants.dto';

export class EditProductVariantsDto extends PartialType(
  OmitType(CreateProductVariantsDto, ['sku'] as const),
) {
  @ApiPropertyOptional({
    name: 'images',
    type: [String],
    example: ['https://google.com/', 'https://instagram.com/'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    type: 'boolean',
    name: 'isActive',
    description: 'Is the variant active',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

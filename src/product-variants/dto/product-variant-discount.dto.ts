import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ProductVaraintsDiscountEnum } from 'src/product-variants/enum/product-variants-discount.enum';

export class ProductVariantsDiscountDto {
  @ApiPropertyOptional({
    name: 'discountType',
    type: 'string',
    enum: ProductVaraintsDiscountEnum,
    default: ProductVaraintsDiscountEnum.NONE,
  })
  @IsEnum(ProductVaraintsDiscountEnum)
  @IsOptional()
  discountType?: ProductVaraintsDiscountEnum;

  @ApiPropertyOptional({
    name: 'value',
    type: 'number',
    default: 0,
  })
  @IsInt()
  @IsOptional()
  value?: number;
}

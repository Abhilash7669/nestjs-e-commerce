import { IsNotEmpty, IsString } from 'class-validator';

export class ProductCategoriesParamsDto {
  @IsString()
  @IsNotEmpty()
  productSlug: string;

  @IsString()
  @IsNotEmpty()
  categorySlug: string;
}

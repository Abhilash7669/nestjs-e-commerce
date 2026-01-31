import { IsNotEmpty, IsString } from 'class-validator';

export class ProductVariantsParamsDto {
  @IsString()
  @IsNotEmpty()
  sku: string;
}

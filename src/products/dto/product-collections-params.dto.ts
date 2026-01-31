import { IsNotEmpty, IsString } from 'class-validator';

export class ProductCollectionsParamsDto {
  @IsString()
  @IsNotEmpty()
  productSlug: string;

  @IsString()
  @IsNotEmpty()
  collectionSlug: string;
}

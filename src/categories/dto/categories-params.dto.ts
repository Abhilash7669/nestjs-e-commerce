import { IsNotEmpty, IsString } from 'class-validator';

export class CategoriesParamsDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}

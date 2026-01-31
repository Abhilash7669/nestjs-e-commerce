import { IsNotEmpty, IsString } from 'class-validator';

export class ProductParamsDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}

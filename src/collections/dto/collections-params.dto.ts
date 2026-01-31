import { IsNotEmpty, IsString } from 'class-validator';

export class CollectionsParamsDto {
  @IsString()
  @IsNotEmpty()
  slug: string;
}

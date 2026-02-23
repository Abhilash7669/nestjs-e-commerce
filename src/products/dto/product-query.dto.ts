import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';

export class ProductQueryDto extends PaginationQueryDto {
  @IsArray()
  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]) as Array<string>,
  )
  @IsString({ each: true })
  @IsOptional()
  size?: string[];

  @IsArray()
  @IsString({ each: true })
  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]) as Array<string>,
  )
  @IsOptional()
  color?: string[];

  @IsString()
  @IsOptional()
  sort?: string;
}

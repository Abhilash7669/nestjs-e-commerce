import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { PAGINATION } from 'src/common/pagination/constants/pagination.constants';

export class PaginationQueryDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = PAGINATION.DEFAULT.page;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = PAGINATION.DEFAULT.limit;
}

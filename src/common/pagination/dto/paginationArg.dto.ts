import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';

export class PaginationArgDto<T> {
  filter: QueryFilter<T>;
  options?: QueryOptions;
  projection?: Record<string, 0 | 1>;
  model: Model<T>;
  paginationQueryDto?: PaginationQueryDto;
}

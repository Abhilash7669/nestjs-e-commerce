import { Model, QueryFilter, QueryOptions } from 'mongoose';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';

export class PaginationArgDto<T> {
  filter: QueryFilter<T>;
  options?: QueryOptions;
  model: Model<T>;
  paginationQueryDto: PaginationQueryDto;
}

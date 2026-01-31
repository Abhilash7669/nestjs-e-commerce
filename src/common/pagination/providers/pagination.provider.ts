import { Injectable } from '@nestjs/common';
import { PAGINATION } from 'src/common/pagination/constants/pagination.constants';
import { PaginationArgDto } from 'src/common/pagination/dto/paginationArg.dto';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T>(paginationArgsDto: PaginationArgDto<T>) {
    const { filter, model, paginationQueryDto, options } = paginationArgsDto;

    const [data, totalItems] = await Promise.all([
      model.find(filter, null, {
        ...options,
        skip:
          ((paginationQueryDto.page || PAGINATION.DEFAULT.page) - 1) *
          (paginationQueryDto.limit || PAGINATION.DEFAULT.limit),
        limit: paginationQueryDto.limit,
      }),
      model.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(
      totalItems / (paginationQueryDto.limit || PAGINATION.DEFAULT.limit),
    );

    const itemsPerPage = paginationQueryDto.limit;
    const currentPage = paginationQueryDto.page;
    const itemsInPage = data.length;
    const hasNextPage = totalPages === paginationQueryDto.page ? false : true;
    const hasPrevPage = paginationQueryDto.page === 1 ? false : true;

    return {
      pagingInfo: {
        itemsPerPage,
        currentPage,
        itemsInPage,
        hasNextPage,
        hasPrevPage,
        totalPages,
      },
      items: data,
    };
  }
}

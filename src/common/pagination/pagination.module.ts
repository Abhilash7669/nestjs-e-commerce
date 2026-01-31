import { Module } from '@nestjs/common';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginationModule {}

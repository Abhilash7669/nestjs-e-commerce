import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateCategoriesDto } from 'src/categories/dto/create-categories.dto';
import { CategoriesService } from 'src/categories/providers/categories.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    /**
     * Dep Injection categoriesService
     */
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get('/')
  @ApiOperation({
    description: 'Gets a list of categories',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Position of the page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Number of entries per query',
    example: 10,
  })
  async getCategories(@Query() paginationQueryDto?: PaginationQueryDto) {
    return await this.categoriesService.getCategories(paginationQueryDto);
  }

  /**
   * @method Get
   * @public
   * @returns Categories Lookups
   */
  @Get('/lookups')
  @ApiOperation({
    description: 'Gets a list of Categoreis Lookup',
  })
  async getCategoriesLookup() {
    return await this.categoriesService.getCategoriesLookup();
  }

  @Post('/')
  @ApiOperation({
    description: 'Creates a category in the database',
  })
  @ApiBody({
    type: CreateCategoriesDto,
  })
  async createCategory(@Body() createCategoriesDto: CreateCategoriesDto) {
    return await this.categoriesService.createCategory(createCategoriesDto);
  }
}

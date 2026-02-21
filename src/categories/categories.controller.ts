import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoriesParamsDto } from 'src/categories/dto/categories-params.dto';
import { CreateCategoriesDto } from 'src/categories/dto/create-categories.dto';
import { EditCategoriesDto } from 'src/categories/dto/edit-categories.dto';
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

  /**
   * Edits a Single Category
   * @method PATCH
   * @param editCategoriesDto
   * @returns Edited Category
   */
  @Patch('/')
  @ApiOperation({
    description: 'Edit a category detail',
  })
  @ApiBody({
    type: EditCategoriesDto,
  })
  editCategory(@Body() editCategoriesDto: EditCategoriesDto) {
    return this.categoriesService.editCategory(editCategoriesDto);
  }

  @Get('/:slug')
  @ApiOperation({
    description: 'Fetches a single Category',
  })
  @ApiParam({
    name: 'slug',
    example: 'saree',
    required: true,
  })
  getCategory(@Param() categoriesParamsDto: CategoriesParamsDto) {
    return this.categoriesService.getCategory(categoriesParamsDto.slug);
  }

  @ApiOperation({
    description: 'Gets products of a single category',
  })
  @ApiParam({
    name: 'slug',
    example: 'jeans',
  })
  @Get('/:slug/products')
  getCategoryProducts(@Param() categoriesParamsDto: CategoriesParamsDto) {
    return this.categoriesService.getCategoryProducts(categoriesParamsDto.slug);
  }
}

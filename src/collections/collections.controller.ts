import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CollectionsParamsDto } from 'src/collections/dto/collections-params.dto';
import { CreateCollectionsDto } from 'src/collections/dto/create-collections.dto';
import { CollectionsService } from 'src/collections/providers/collections.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';

@Controller('collections')
export class CollectionsController {
  constructor(
    /**
     * Dependency Injection collectionsService
     */
    private readonly collectionsService: CollectionsService,
  ) {}

  /**
   * todo: add query params later for size, limit...
   * @method GET
   * @public
   * @returns List of Paginated Collection
   */
  @Get('/')
  @ApiOperation({
    description: 'Gets a paginated list of Collection',
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
  async getCollections(@Query() paginationQueryDto?: PaginationQueryDto) {
    return await this.collectionsService.getCollections(paginationQueryDto);
  }

  /**
   * @method Get
   * @public
   * @returns Collections Lookups
   */
  @Get('/lookups')
  @ApiOperation({
    description: 'Gets a list of Collection Lookup',
  })
  getCollectionsLookups() {
    return this.collectionsService.getCollectionLookups();
  }

  /**
   * Creates a collection
   * @method POST
   * @private
   * @param createCollectionsDto
   * @returns Created Collection
   */
  @Post('/')
  @ApiOperation({
    description: 'Creates a collection in the database',
  })
  @ApiBody({
    type: CreateCollectionsDto,
  })
  async createCollection(@Body() createCollectionsDto: CreateCollectionsDto) {
    return await this.collectionsService.createCollection(createCollectionsDto);
  }

  /**
   * @method GET
   * @private
   * @param collectionsParamsDto collection slug
   * @returns Single Collection
   */
  @Get('/:slug')
  @ApiOperation({
    description: 'Fetches a single Collection',
  })
  @ApiParam({
    name: 'slug',
    example: 'kinav-summer-collection',
    required: true,
  })
  async getCollection(@Param() collectionsParamsDto: CollectionsParamsDto) {
    return await this.collectionsService.getCollection(
      collectionsParamsDto.slug,
    );
  }

  /**
   * @method GET
   * @public
   * @param collectionsParamsDto collection slug
   * @returns Products related to a collection
   */
  @Get('/:slug/products')
  @ApiOperation({
    description: 'Fetches products of a collection',
  })
  @ApiParam({
    name: 'slug',
    example: 'kinav-summer-collection',
    required: true,
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
  async getCollectionProducts(
    @Param() collectionsParamsDto: CollectionsParamsDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return await this.collectionsService.getCollectionProducts(
      collectionsParamsDto.slug,
      paginationQueryDto,
    );
  }
}

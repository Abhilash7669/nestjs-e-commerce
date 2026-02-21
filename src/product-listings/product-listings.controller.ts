import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';
import { CreateProductListingsDto } from 'src/product-listings/dto/create-product-listings.dto';
import { ProductListingsService } from 'src/product-listings/providers/product-listings.service';

@Controller('product-listings')
export class ProductListingsController {
  constructor(
    /**
     * DI productListingsService
     */
    private readonly productListingsService: ProductListingsService,
  ) {}

  /**
   * Gets Paginated list of Product Listings
   * @param paginationQueryDto
   * @returns Paginated list of Product Listings
   */
  @ApiOperation({
    description: 'Gets a paginated list of Product Listings',
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
  @Get('/')
  getPaginatedProductListings(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.productListingsService.getPaginatedProductListings(
      paginationQueryDto,
    );
  }

  /**
   * @private todo: later make private
   * @param createProductListingsDto
   * @returns Created Product Listing Dto
   */
  @ApiOperation({
    description: 'Creates a product listing',
  })
  @ApiBody({
    type: CreateProductListingsDto,
  })
  @Post('/')
  createProductListing(
    @Body() createProductListingsDto: CreateProductListingsDto,
  ) {
    return this.productListingsService.createProductListing(
      createProductListingsDto,
    );
  }
}

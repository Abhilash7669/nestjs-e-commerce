import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateProductsDto } from 'src/products/dto/create-products.dto';
import { ProductCategoriesParamsDto } from 'src/products/dto/product-categories-params.dto';
import { ProductCollectionsParamsDto } from 'src/products/dto/product-collections-params.dto';
import { ProductParamsDto } from 'src/products/dto/product-params.dto';
import { ProductQueryDto } from 'src/products/dto/product-query.dto';
import { ProductsService } from 'src/products/providers/products.service';

@Controller('products')
export class ProductsController {
  constructor(
    /**
     * Injecting productsService
     */
    private readonly productsService: ProductsService,
  ) {}

  @Get('/')
  @ApiOperation({
    description: 'Paginated Product Results for a product listing page',
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
  @ApiQuery({
    name: 'size',
    type: 'string',
    required: false,
    description: 'size of product',
    example: 'L',
  })
  @ApiQuery({
    name: 'color',
    type: 'string',
    required: false,
    description: 'Color of the product',
    example: 'Black',
  })
  async findAll(@Query() productQueryDto: ProductQueryDto) {
    return await this.productsService.findAll(productQueryDto);
  }

  /**
   * Creates a product
   * @param createProductsDto
   * @private
   * @returns Created Product
   */
  @Post('/')
  @ApiOperation({
    description: 'Creates a product in database',
  })
  @ApiBody({
    type: CreateProductsDto,
  })
  async createProduct(@Body() createProductsDto: CreateProductsDto) {
    return await this.productsService.createProduct(createProductsDto);
  }

  /**
   * @private
   * @method Patch
   * @param productCollectionsParamsDto
   * @returns Updated product
   */
  @Patch('/:productSlug/collections/:collectionSlug')
  @ApiOperation({
    description: 'Adds a collection to a product',
  })
  @ApiParam({
    name: 'productSlug',
    example: 'black-some-saree',
    required: true,
  })
  @ApiParam({
    name: 'collectionSlug',
    example: 'kinav-collection',
    required: true,
  })
  async addCollectionToProduct(
    @Param() productCollectionsParamsDto: ProductCollectionsParamsDto,
  ) {
    return await this.productsService.addCollectionToProduct(
      productCollectionsParamsDto,
    );
  }

  /**
   * Update a category in a product
   * @method Patch
   * @private
   * @param productCategoriesParamsDto
   * @returns Updated Category field of a Product
   */
  @Patch('/:productSlug/categories/:categorySlug')
  @ApiOperation({
    description: 'Updates a category in a product',
  })
  @ApiParam({
    name: 'productSlug',
    example: 'yellow-saree',
    required: true,
  })
  @ApiParam({
    name: 'categorySlug',
    example: 'saree',
    required: true,
  })
  async updateCategoryInProduct(
    @Param() productCategoriesParamsDto: ProductCategoriesParamsDto,
  ) {
    return await this.productsService.updateCategoryInProduct(
      productCategoriesParamsDto,
    );
  }

  /**
   * Removes a collection from a product
   * @private
   * @param productCollectionsParamsDto
   * @returns Updated Product
   */
  @Delete('/:productSlug/collections/:collectionSlug')
  @ApiOperation({
    description: 'Removes a collection from a product',
  })
  @ApiParam({
    name: 'productSlug',
    example: 'black-some-saree',
    required: true,
  })
  @ApiParam({
    name: 'collectionSlug',
    example: 'kinav-collection',
    required: true,
  })
  async removeCollectionFromProduct(
    @Param() productCollectionsParamsDto: ProductCollectionsParamsDto,
  ) {
    return await this.productsService.removeCollectionFromProduct(
      productCollectionsParamsDto,
    );
  }

  /**
   * Soft deletes a product
   * @param productParamsDto
   * @private
   * @returns Soft deleted product
   */
  @ApiOperation({
    description: 'Soft deletes a product',
  })
  @ApiParam({
    name: 'slug',
    example: 'black-some-saree',
    required: true,
  })
  @Delete('/:slug')
  async softDeleteProduct(@Param() productParamsDto: ProductParamsDto) {
    return await this.productsService.softDeleteProduct(productParamsDto.slug);
  }

  @Get('/:slug')
  @ApiOperation({
    description: 'Finds product details and product variants of a product',
  })
  @ApiParam({
    name: 'slug',
    example: 'black-some-saree',
    required: true,
  })
  async findProduct(@Param() productParamsDto: ProductParamsDto) {
    return await this.productsService.findProduct(productParamsDto.slug);
  }
}

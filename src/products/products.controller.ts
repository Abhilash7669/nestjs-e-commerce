import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateProductsDto } from 'src/products/dto/create-products.dto';
import { ProductCollectionsParamsDto } from 'src/products/dto/product-collections-params.dto';
import { ProductParamsDto } from 'src/products/dto/product-params.dto';
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
  async findAll() {
    return await this.productsService.findAll();
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
}

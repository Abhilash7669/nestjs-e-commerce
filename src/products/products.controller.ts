import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateProductsDto } from 'src/products/dto/create-products.dto';
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
   * Soft deletes a product
   * @param productParamsDto
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

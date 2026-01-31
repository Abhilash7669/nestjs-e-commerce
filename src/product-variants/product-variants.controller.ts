import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateProductVariantsDto } from 'src/product-variants/dto/create-product-variants.dto';
import { EditProductVariantsDto } from 'src/product-variants/dto/edit-product-variants.dto';
import { ProductVariantsParamsDto } from 'src/product-variants/dto/product-variants-params.dto';
import { ProductVariantsService } from 'src/product-variants/providers/product-variants.service';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    /**
     * Inject Dependency productVariantsService
     */
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  @ApiOperation({
    description: 'Finds all Product Variant controller',
  })
  @Get('/')
  async findAllProductVariant() {
    return await this.productVariantsService.findAllProductVariant();
  }

  @ApiOperation({
    description: 'Creates a single product variant',
  })
  @Post('/')
  async createProductVariant(
    @Body() createProductVariantsDto: CreateProductVariantsDto,
  ) {
    return await this.productVariantsService.createProductVariant(
      createProductVariantsDto,
    );
  }

  /**
   * Edits a single Product Variant
   * @param editProductVariantsDto
   * @param productVariantsParamsDto
   * @returns Edited Product
   */
  @ApiOperation({
    description: 'Edits a single product variant',
  })
  @ApiParam({
    name: 'sku',
    description: 'Sku of the product variant',
    required: true,
    example: 'SKU-BLCK-DRESS-XL',
  })
  @Patch('/:sku')
  async editProductVariant(
    @Body() editProductVariantsDto: EditProductVariantsDto,
    @Param() productVariantsParamsDto: ProductVariantsParamsDto,
  ) {
    return await this.productVariantsService.editProductVariant(
      productVariantsParamsDto.sku,
      editProductVariantsDto,
    );
  }

  @ApiOperation({
    description: 'Soft deletes a product variant',
  })
  @ApiParam({
    name: 'sku',
    description: 'Sku of the product variant',
    required: true,
    example: 'SKU-BLCK-DRESS-XL',
  })
  @Delete('/:sku')
  async softDeleteProductVariant(
    @Param() productVariantsParamsDto: ProductVariantsParamsDto,
  ) {
    return await this.productVariantsService.softDeleteProductVariant(
      productVariantsParamsDto.sku,
    );
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateSlug } from 'src/common/utils/slug.utils';
import { CreateProductsDto } from 'src/products/dto/create-products.dto';
import { ProductParamsDto } from 'src/products/dto/product-params.dto';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    /**
     * Model Injection
     */
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findAll() {
    const products = await this.productModel.find({}, { _id: 0 }).limit(10);
    return products;
  }

  /**
   * Create a product
   */
  async createProduct(createProductsDto: CreateProductsDto) {
    const generatedSlug: string = generateSlug(createProductsDto.name);

    // find if product already exists based on slug
    const productExists = await this.productModel.findOne({
      slug: generatedSlug,
    });

    if (productExists) throw new ConflictException('Product already exists');

    const product = new this.productModel({
      ...createProductsDto,
      slug: generatedSlug,
    });
    return await product.save();
  }

  /**
   * Soft deletes a product
   * @param slug
   * @returns Updated Product
   */
  async softDeleteProduct(slug: ProductParamsDto['slug']) {
    const product = await this.productModel.findOneAndUpdate(
      {
        slug,
      },
      { isActive: false },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}

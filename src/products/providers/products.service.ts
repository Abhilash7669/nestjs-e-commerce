import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, Types } from 'mongoose';
import { CollectionsService } from 'src/collections/providers/collections.service';
import { generateSlug } from 'src/common/utils/slug.utils';
import { CreateProductsDto } from 'src/products/dto/create-products.dto';
import { ProductCollectionsParamsDto } from 'src/products/dto/product-collections-params.dto';
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

    /**
     * Dep Inject collectionsService
     * Circular dep with ProductsModule
     */
    @Inject(forwardRef(() => CollectionsService))
    private readonly collectionsService: CollectionsService,
  ) {}

  async findAll() {
    const products = await this.productModel.find({}, { _id: 0 }).limit(10);
    return products;
  }

  /**
   * Gets products related to a collection
   * @public
   * todo: paginated result and query params for pagination
   * @param collectionId
   * @returns Products for that collection
   */
  async findProductInCollection(collectionId: Types.ObjectId) {
    const products = await this.productModel.find(
      {
        collections: { $in: [collectionId] },
        isActive: true,
      },
      { collections: 0, __v: 0, _id: 0, isManualNewOverride: 0, isActive: 0 },
    );

    if (!products) {
      throw new NotFoundException('No products for collection found');
    }

    return products;
  }

  /**
   * Assing a collection id to the product
   * @param productId
   * @private
   * @param collectionSlug
   * @returns Updated product
   */
  async addCollectionToProduct(
    productCollectionsParamsDto: ProductCollectionsParamsDto,
  ) {
    const collectionExists = await this.collectionsService.getCollection(
      productCollectionsParamsDto.collectionSlug,
    );

    if (!collectionExists) {
      throw new NotFoundException(
        `${productCollectionsParamsDto.collectionSlug}, collection does not exist`,
      );
    }

    try {
      // find productId and update
      const updatedProduct = await this.productModel.findOneAndUpdate(
        {
          slug: productCollectionsParamsDto.productSlug,
        },
        {
          $addToSet: {
            collections: collectionExists._id,
          },
        },
        {
          new: true,
        },
      );

      return updatedProduct;
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Removes a collection id from a product
   * @param productId
   * @private
   * @param collectionSlug
   * @returns Updated product
   */
  async removeCollectionFromProduct(
    productCollectionsParamsDto: ProductCollectionsParamsDto,
  ) {
    const collection = await this.collectionsService.getCollection(
      productCollectionsParamsDto.collectionSlug,
    );

    if (!collection) {
      throw new NotFoundException('No collection Found');
    }

    try {
      const product = await this.productModel.findOneAndUpdate(
        {
          slug: productCollectionsParamsDto.productSlug,
        },
        {
          $unset: {
            collections: collection._id,
          },
        },
        {
          new: true,
        },
      );
      return product;
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Create a product
   * @private
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
   * @private
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

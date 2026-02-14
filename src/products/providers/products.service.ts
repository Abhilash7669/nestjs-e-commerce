import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, QueryFilter, Types } from 'mongoose';
import { CategoriesService } from 'src/categories/providers/categories.service';
import { CollectionsService } from 'src/collections/providers/collections.service';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { generateSlug } from 'src/common/utils/text/slugify.utils';
import { applyVariantDiscount } from 'src/product-variants/domain/pricing/applyVariantDiscount';
import { ProductVariantsService } from 'src/product-variants/providers/product-variants.service';
import { CreateProductsDto } from 'src/products/dto/create-products.dto';
import { ProductCategoriesParamsDto } from 'src/products/dto/product-categories-params.dto';
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

    /**
     * Dep Inject paginationProvider
     */
    private readonly paginationProvider: PaginationProvider,

    /**
     * Dep Inject categoriesService
     */
    private readonly categoriesService: CategoriesService,

    /**
     * Dep Inject productVariantsService
     */
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  /**
   *
   * @param paginationQueryDto
   * @returns Paginated list of active products
   */
  async findAll(
    paginationQueryDto: PaginationQueryDto,
    queryFilter?: QueryFilter<ProductDocument>,
  ) {
    const products = await this.paginationProvider.paginateQuery({
      filter: {
        isActive: true,
        ...(queryFilter ?? {}),
      },
      projection: {
        _id: 0,
        __v: 0,
      },
      model: this.productModel,
      paginationQueryDto,
    });
    return products;
  }

  /**
   *
   * @param productSlug
   * @returns Product and it's variants
   */
  async findProduct(productSlug: ProductParamsDto['slug']) {
    const product = await this.productModel
      .findOne(
        {
          isActive: true,
          slug: productSlug,
        },
        {
          isActive: 0,
          isManualNewOverride: 0,
          __v: 0,
        },
      )
      .populate('category', 'name slug');

    if (!product) {
      throw new NotFoundException(`Product ${productSlug} not found`);
    }

    const productVariants =
      await this.productVariantsService.findAllVariantByProductId(product._id);

    if (productVariants && productVariants.length === 0) {
      return {
        product,
        variants: [],
      };
    }

    const finalVariant = productVariants.map((variant) => {
      // domain function to calculate discount
      const discountedPrice = applyVariantDiscount(
        variant.discount,
        variant.price,
      );

      return {
        ...variant,
        discountedPrice,
      };
    });

    // todo: handle response type properly. Currently in test phase
    return {
      product,
      variants: finalVariant,
      totalVariants: productVariants.length,
    };
  }

  /**
   * Gets products related to a collection
   * @public
   * @param collectionId
   * @returns Products for that collection
   */
  async findProductInCollection(
    collectionId: Types.ObjectId,
    paginationQueryDto?: PaginationQueryDto,
  ) {
    const paginatedData = await this.paginationProvider.paginateQuery({
      filter: {
        collections: { $in: [collectionId] },
        isActive: true,
      },
      projection: {
        _id: 0,
        isManualNewOverride: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        isActive: 0,
        collections: 0,
        category: 0,
      },
      model: this.productModel,
      paginationQueryDto,
    });

    if (!paginatedData) {
      throw new NotFoundException('No products for collection found');
    }

    return paginatedData;
  }

  async updateCategoryInProduct(
    productCategoriesParamsDto: ProductCategoriesParamsDto,
  ) {
    const category = await this.categoriesService.getCategory(
      productCategoriesParamsDto.categorySlug,
    );

    const product = await this.productModel.findOneAndUpdate(
      {
        slug: productCategoriesParamsDto.productSlug,
      },
      {
        category: category._id,
      },
      {
        new: true,
      },
    );

    if (!product) {
      throw new NotFoundException(
        `Product ${productCategoriesParamsDto.productSlug} does not exist`,
      );
    }

    return product;
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

    // find if category exists and extract the id
    const category = await this.categoriesService.getCategory(
      createProductsDto.category,
    );

    const product = new this.productModel({
      ...createProductsDto,
      slug: generatedSlug,
      category: category._id,
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

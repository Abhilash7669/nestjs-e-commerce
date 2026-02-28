import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Connection,
  Model,
  MongooseError,
  QueryFilter,
  QueryOptions,
  Types,
} from 'mongoose';
import { CreateProductVariantsDto } from 'src/product-variants/dto/create-product-variants.dto';
import { EditProductVariantsDto } from 'src/product-variants/dto/edit-product-variants.dto';
import { ProductVariantsParamsDto } from 'src/product-variants/dto/product-variants-params.dto';
import {
  ProductVariant,
  ProductVariantDocument,
} from 'src/product-variants/schema/product-variants.schema';

@Injectable()
export class ProductVariantsService {
  constructor(
    /**
     * Inject Model productVariantModel
     */
    @InjectModel(ProductVariant.name)
    private readonly productVariantModel: Model<ProductVariantDocument>,
    /**
     * Inject Connection for session
     */
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  /**
   * Find All Product Variant
   * todo: To make it paginated
   */
  async findAllProductVariant(
    queryFilter?: QueryFilter<ProductVariantDocument>,
    queryOptions?: QueryOptions,
  ) {
    try {
      const productVariants = await this.productVariantModel
        .find(
          {
            isActive: true,
            ...(queryFilter || {}),
          },
          {
            // todo: can bring projection later here
          },
          {
            ...(queryOptions || {}),
          },
        )
        .lean();

      if (!productVariants) {
        throw new NotFoundException('No product variants found');
      }

      return productVariants;
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * @param productId
   * @returns All variants of a Product
   */
  async findAllVariantByProductId(
    productId: Types.ObjectId[],
    queryFilter?: QueryFilter<ProductVariantDocument>,
  ) {
    try {
      const productVariants = await this.productVariantModel
        .find(
          {
            productId: {
              $in: productId,
            },
            ...(queryFilter || {}),
            // 'attribute.size': 'L', todo: come back later
          },
          {
            __v: 0,
          },
          {
            sort: {
              'attribute.size': 1,
            },
          },
        )
        .lean();
      return productVariants;
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Finds a single variant
   * @param param
   * @returns Single Variant
   */
  async findVariant(variantId: string): Promise<ProductVariantDocument> {
    const variant = await this.productVariantModel
      .findOne({
        _id: new Types.ObjectId(variantId),
      })
      .lean();

    if (!variant) {
      throw new NotFoundException(`Product not found`);
    }

    return variant;
  }

  /**
   * Finds a single variant by sku
   * @param sku
   */
  async findVariantBySku(sku: string): Promise<ProductVariantDocument> {
    try {
      const variant = await this.productVariantModel.findOne({
        sku,
      });

      if (!variant) throw new NotFoundException('Variant not found');
      return variant;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Creates a product variant
   * @param createProductVariantDto
   * @returns Created Product
   */
  async createProductVariant(
    createProductVariantsDto: CreateProductVariantsDto,
  ) {
    const session = await this.connection.startSession(); // not really required when interacting with one model
    session.startTransaction();
    try {
      // check if zoho/any item exists
      const productExists = await this.productVariantModel.findOne({
        sku: createProductVariantsDto.sku,
      });
      if (productExists) {
        throw new BadRequestException('Product Already exists');
      }

      const createdProduct = new this.productVariantModel({
        ...createProductVariantsDto,
        productId: createProductVariantsDto.productId
          ? new Types.ObjectId(createProductVariantsDto.productId)
          : null,
      });
      await createdProduct.save();
      await session.commitTransaction();
      return createdProduct;
    } catch (error) {
      if (error instanceof MongooseError) {
        console.log(error, 'ERROR INSTANCE');
        throw new BadRequestException(error.message);
      }
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * Edits a single product variant item
   * @param editProductVariants
   */
  async editProductVariant(
    sku: ProductVariantsParamsDto['sku'],
    editProductVariantsDto: EditProductVariantsDto,
  ) {
    const updatedPayload: Record<string, unknown> = {};

    Object.entries(editProductVariantsDto).forEach(([key, value]) => {
      updatedPayload[key] =
        key === 'productId' ? new Types.ObjectId(value as string) : value;
    });

    if (Object.keys(updatedPayload).length === 0) {
      throw new BadRequestException('No values to be updated');
    }

    const product = await this.productVariantModel.findOneAndUpdate(
      {
        sku,
      },
      {
        $set: updatedPayload,
      },
      {
        runValidators: true,
        new: true,
      },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /**
   * Soft deletes a product variant
   * @param sku From query params sku to identify the product variant
   * @returns Soft deleted product
   */
  async softDeleteProductVariant(sku: ProductVariantsParamsDto['sku']) {
    const productVariant = await this.productVariantModel.findOneAndUpdate(
      {
        sku,
      },
      {
        $set: {
          isActive: false,
        },
      },
      { new: true },
    );

    if (!productVariant) {
      throw new NotFoundException('Product Variant Not Found');
    }

    return productVariant;
  }
}

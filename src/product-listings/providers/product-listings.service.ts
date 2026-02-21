import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { CreateProductListingsDto } from 'src/product-listings/dto/create-product-listings.dto';
import {
  ProductListing,
  ProductListingDocument,
} from 'src/product-listings/schema/product-listing.schema';

@Injectable()
export class ProductListingsService {
  constructor(
    /**
     * Inject ProductListing Model
     */
    @InjectModel(ProductListing.name)
    private readonly productListingModel: Model<ProductListingDocument>,

    /**
     * DI paginationProvider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  /**
   * Creates a single Product Listing
   * @param createProductListingsDto
   * @returns Created Product listing
   */
  async createProductListing(
    createProductListingsDto: CreateProductListingsDto,
  ) {
    try {
      const productListing = new this.productListingModel({
        ...createProductListingsDto,
        productId: new Types.ObjectId(createProductListingsDto.productId),
      });

      return await productListing.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message ?? 'Something went wrong');
      }
      throw error;
    }
  }

  /**
   * Gets Paginated list of Product Listings
   * @param paginationQueryDto
   * @returns Paginated List of Product Listings
   */
  async getPaginatedProductListings(paginationQueryDto: PaginationQueryDto) {
    // todo: can bring in options via query params for sorting and filter, applies to all paginated search and search!
    const productListings = await this.paginationProvider.paginateQuery({
      model: this.productListingModel,
      filter: {},
      projection: {
        __v: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
      },
      options: {
        sort: {
          priority: 1,
        },
      },
      paginationQueryDto,
    });

    if (!productListings) {
      throw new NotFoundException('No product listings found');
    }
    return productListings;
  }

  /**
   * todo: re-think about aggregation to work with datasets
   * @param listingTypes
   * @returns Product listing based on listing types passed
   */
  async getProductListings(listingTypes?: string[]) {
    const query: QueryFilter<ProductListingDocument> = {};
    if (listingTypes && listingTypes.length > 0) {
      query.type = { $in: listingTypes };
    }
    const productListing = await this.productListingModel
      .find(query, { _id: 0, __v: 0 }, { limit: 10 })
      .populate('productId', 'name slug basePrice images');

    if (!productListing) {
      throw new NotFoundException('No product Listing found');
    }
    const ourObj: Record<string, Array<ProductListing>> = {};
    /**
     * Empty object
     * group by type and create an object key
     * initialize empty array
     * then push into matching key value
     */
    for (const productList of productListing) {
      if (!ourObj[productList.type]) {
        ourObj[productList.type] = [];
      }

      ourObj[productList.type].push(productList);
    }

    return ourObj;
  }
}

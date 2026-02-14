import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError, QueryFilter } from 'mongoose';
import { CollectionsParamsDto } from 'src/collections/dto/collections-params.dto';
import { CreateCollectionsDto } from 'src/collections/dto/create-collections.dto';
import {
  Collection,
  CollectionDocument,
} from 'src/collections/schema/collections.schema';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { generateSlug } from 'src/common/utils/text/slugify.utils';
import { ProductsService } from 'src/products/providers/products.service';

@Injectable()
export class CollectionsService {
  constructor(
    /**
     * Inject model collectionModel
     */
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<CollectionDocument>,

    /**
     * Circular dep with ProductsModule
     * Dep Inj productsService
     */
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,

    /**
     * Dep Inject paginationProvider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  /**
   * Retrieves a list of Paginated Collections
   * @returns Collections List
   */
  async getCollections(paginationQueryDto?: PaginationQueryDto) {
    const collections = await this.paginationProvider.paginateQuery({
      model: this.collectionModel,
      filter: {
        isActive: true,
      },
      projection: {
        _id: 0,
        __v: 0,
      },
      paginationQueryDto,
    });

    if (!collections) {
      throw new NotFoundException('No collections found');
    }

    return collections;
  }

  /**
   * Retrieves a single collection
   * @param slug
   * @returns Single Collection
   */
  async getCollection(slug: CollectionsParamsDto['slug']) {
    const start = performance.now();
    const collection = await this.collectionModel
      .findOne(
        {
          slug,
        },
        { __v: 0 },
      )
      .lean();

    if (!collection) {
      throw new NotFoundException(`Collection Not found for ${slug}`);
    }

    // has collection - get collection id - search through products with this collection id
    const end = performance.now();
    console.log(
      `SINGLE COLLECTION DETAILS WITHOUT PRODUCTS TOOK ${end - start}ms time`,
    );
    return collection;
  }

  /**
   * @returns Collections Lookups
   */
  async getCollectionLookups(filter?: QueryFilter<CollectionDocument>) {
    try {
      const collectionLookups = await this.collectionModel.find(
        { isActive: true, ...filter },
        { name: 1, slug: 1, _id: 0 },
      );

      if (!collectionLookups || collectionLookups.length === 0) return [];
      return collectionLookups;
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * @returns Collections Lookups list where showInMenu is true
   */
  async getMenuCollectionLookups() {
    return await this.getCollectionLookups({ showInMenu: true });
  }

  /**
   * Gets Products in a collection
   * @param slug
   * @returns Products In that collection
   */
  async getCollectionProducts(
    slug: CollectionsParamsDto['slug'],
    paginationQueryDto?: PaginationQueryDto,
  ) {
    const collection = await this.getCollection(slug);

    // has collection - get collection id - search through products with this collection id
    const products = await this.productsService.findProductInCollection(
      collection._id,
      paginationQueryDto,
    );

    return products;
  }

  /**
   * Creates a new collection
   * @param createCollectionsDto
   * @returns Created Collection
   */
  async createCollection(createCollectionsDto: CreateCollectionsDto) {
    // convert name to slug
    const collectionSlug = generateSlug(createCollectionsDto.name);

    try {
      // check if collection already exists
      const collection = await this.collectionModel.findOneAndUpdate(
        {
          slug: collectionSlug,
        },
        {
          $setOnInsert: {
            ...createCollectionsDto,
            slug: collectionSlug,
          },
        },
        { upsert: true, new: true },
      );
      return collection;
    } catch (error) {
      console.log(error, 'ERROR');
      if (error instanceof MongooseError) {
        throw new BadRequestException(error.message);
      }
    }
  }
}

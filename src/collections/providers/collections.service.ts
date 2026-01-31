import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { CollectionsParamsDto } from 'src/collections/dto/collections-params.dto';
import { CreateCollectionsDto } from 'src/collections/dto/create-collections.dto';
import {
  Collection,
  CollectionDocument,
} from 'src/collections/schema/collections.schema';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';
import { generateSlug } from 'src/common/utils/slug.utils';
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
  ) {}

  /**
   * Retrieves a list of Collections
   * todo: Paginate it later
   * @returns Collections List
   */
  async getCollections() {
    const collections = await this.collectionModel
      .find({}, { _id: 0, __v: 0 })
      .limit(10);

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

    return collection;
  }

  /**
   * Gets Products in a collection
   * @param slug
   * @returns Products In that collection
   */
  async getCollectionProducts(
    slug: CollectionsParamsDto['slug'],
    paginationQueryDto: PaginationQueryDto,
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

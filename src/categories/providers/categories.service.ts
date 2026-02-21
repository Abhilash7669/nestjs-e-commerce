import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { CategoriesParamsDto } from 'src/categories/dto/categories-params.dto';
import { CreateCategoriesDto } from 'src/categories/dto/create-categories.dto';
import { EditCategoriesDto } from 'src/categories/dto/edit-categories.dto';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schema/category.schema';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { generateSlug } from 'src/common/utils/text/slugify.utils';
import { ProductsService } from 'src/products/providers/products.service';

@Injectable()
export class CategoriesService {
  constructor(
    /**
     * Inject model
     */
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    /**
     * Dep Inject paginationProvider
     */
    private readonly paginationProvider: PaginationProvider,

    /**
     * Dep Inject (circular dep)
     */
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Paginated list of Categories
   * @returns Categories
   */
  async getCategories(paginationQueryDto?: PaginationQueryDto) {
    const categories = await this.paginationProvider.paginateQuery({
      model: this.categoryModel,
      filter: {
        isActive: true,
      },
      projection: {
        name: 1,
        slug: 1,
        _id: 0,
      },
      paginationQueryDto,
    });

    if (!categories) {
      throw new NotFoundException('No categories found');
    }
    return categories;
  }

  /**
   * @returns latest categories
   */
  async getLatestCategories() {
    const categories = await this.categoryModel.find(
      { isActive: true },
      { __v: 0, _id: 0, createdAt: 0, updatedAt: 0 },
      { limit: 5, sort: { createdAt: -1 } },
    );

    if (!categories) {
      throw new NotFoundException('No categories found');
    }
    return categories;
  }

  /**
   * Fetches a list of categories lookup
   * @returns Categories Lookup
   */
  async getCategoriesLookup(filter?: QueryFilter<CategoryDocument>) {
    try {
      const categoriesLookups = await this.categoryModel.find(
        {
          isActive: true,
          ...filter,
        },
        { name: 1, slug: 1, _id: 0 },
      );
      return categoriesLookups;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  /**
   * @returns Categories Lookups list where showInMenu is true
   */
  async getMenuCategoriesLookup() {
    return await this.getCategoriesLookup({
      showInMenu: true,
    });
  }

  /**
   * Find a category by it's slug
   * @param categorySlug
   * @returns A Category
   */
  async getCategory(categorySlug: CategoriesParamsDto['slug']) {
    const category = await this.categoryModel
      .findOne(
        {
          slug: categorySlug,
        },
        {
          __v: 0,
        },
      )
      .lean();

    if (!category) {
      throw new NotFoundException(`No category found for ${categorySlug}`);
    }

    return category;
  }

  /**
   * Get List of Products in a category
   * @param categorySlug
   * @returns Paginated Result for Products list of a category
   */
  async getCategoryProducts(categorySlug: CategoriesParamsDto['slug']) {
    const category = await this.getCategory(categorySlug);
    const products = await this.productsService.findAll(
      { limit: 10, page: 1 },
      { category: new Types.ObjectId(category._id) },
    );

    if (!products) {
      throw new NotFoundException(
        `No products found for category: ${categorySlug}`,
      );
    }

    return products;
  }

  // =======================
  // NON-READ OPS
  // =======================

  /**
   * Creates a category in the database
   * @param createCategoriesDto
   * @returns Created category
   */
  async createCategory(createCategoriesDto: CreateCategoriesDto) {
    // generate slug
    const categorySlug = generateSlug(createCategoriesDto.name);

    // find if category already exists
    const categoryExists = await this.categoryModel.findOne({
      slug: categorySlug,
    });

    if (categoryExists) {
      throw new ConflictException('Category already exists');
    }

    const category = new this.categoryModel({
      ...createCategoriesDto,
      slug: categorySlug,
    });

    return await category.save();
  }

  /**
   * todo: handle cascading cases
   * Edit a category in the database
   */
  async editCategory(editCategoriesDto: EditCategoriesDto) {
    if (!editCategoriesDto.name) {
      throw new BadRequestException('Category name is required');
    }
    const categorySlug = generateSlug(editCategoriesDto.name);

    const query: Record<string, string> = {};

    if (editCategoriesDto.description)
      query['description'] = editCategoriesDto.description;
    if (editCategoriesDto.imageUrl)
      query['imageUrl'] = editCategoriesDto.imageUrl;

    const category = await this.categoryModel
      .findOneAndUpdate({ slug: categorySlug }, { $set: query }, { new: true })
      .lean();

    if (!category) {
      throw new NotFoundException(
        `Category: ${editCategoriesDto.name} not found`,
      );
    }

    return category;
  }
}

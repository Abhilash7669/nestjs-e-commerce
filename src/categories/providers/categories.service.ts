import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { CreateCategoriesDto } from 'src/categories/dto/create-categories.dto';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schema/category.schema';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQuery.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { generateSlug } from 'src/common/utils/text/slugify.utils';

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
  async getCategory(categorySlug: string) {
    const category = await this.categoryModel
      .findOne({
        slug: categorySlug,
      })
      .lean();

    if (!category) {
      throw new NotFoundException(`No category found for ${categorySlug}`);
    }

    return category;
  }

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
}

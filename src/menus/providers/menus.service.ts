import { BadRequestException, Injectable } from '@nestjs/common';
import { MongooseError } from 'mongoose';
import { CategoriesService } from 'src/categories/providers/categories.service';
import { CollectionsService } from 'src/collections/providers/collections.service';

@Injectable()
export class MenusService {
  constructor(
    /**
     * Dep Inject categoriesService
     */
    private readonly categoriesService: CategoriesService,
    /**
     * Dep Inject collectionsService
     */
    private readonly collectionsService: CollectionsService,
  ) {}

  /**

   * @returns Main Menu Items
   */
  async getMainMenu() {
    try {
      const start = performance.now();
      const [categories, collections] = await Promise.all([
        this.categoriesService.getMenuCategoriesLookup(),
        this.collectionsService.getMenuCollectionLookups(),
      ]);
      const end = performance.now();
      console.log(`MENUS API TOOK ${end - start}ms`);
      // todo: standardize response DTO
      return [
        { title: 'categories', items: categories ?? null },
        { title: 'collections', items: collections ?? null },
      ];
    } catch (error) {
      if (error instanceof MongooseError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}

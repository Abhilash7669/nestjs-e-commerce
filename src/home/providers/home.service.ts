import { Injectable } from '@nestjs/common';
import { CategoriesService } from 'src/categories/providers/categories.service';
import { CollectionsService } from 'src/collections/providers/collections.service';
import { ProductListingsEnum } from 'src/product-listings/enum/product-listings.enum';
import { ProductListingsService } from 'src/product-listings/providers/product-listings.service';

@Injectable()
export class HomeService {
  constructor(
    /**
     * DI collections service
     */
    private readonly collectionsService: CollectionsService,
    /**
     * DI categories service
     */
    private readonly categoriesService: CategoriesService,
    /**
     * DI productListingsService
     */
    private readonly productListingsService: ProductListingsService,
  ) {} // inject necessary services

  /**
   * Gets Home data for collections, categories, productListing(featured, sales)
   * @returns Home Page data, collection, categories, featured, sales
   */
  async getHomeData() {
    const start = performance.now();
    const [categories, collections, productListing] = await Promise.all([
      // parallel fetch
      this.categoriesService.getLatestCategories(),
      this.collectionsService.getLatestCollection(),
      this.productListingsService.getProductListings([
        ProductListingsEnum.FEATURED,
        ProductListingsEnum.SALE,
      ]),
    ]);
    const end = performance.now();
    console.log(`Time for home data: ${end - start}ms`);
    return {
      categories,
      collections,
      ...(productListing ?? {}),
      // featured,
      // sales
    };
  }
}

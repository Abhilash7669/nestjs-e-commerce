import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './providers/home.service';
import { CollectionsModule } from 'src/collections/collections.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductListingsModule } from 'src/product-listings/product-listings.module';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [CollectionsModule, CategoriesModule, ProductListingsModule],
})
export class HomeModule {}

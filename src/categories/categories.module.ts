import { forwardRef, Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './providers/categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
} from 'src/categories/schema/category.schema';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    PaginationModule,
    forwardRef(() => ProductsModule),
  ],
})
export class CategoriesModule {}

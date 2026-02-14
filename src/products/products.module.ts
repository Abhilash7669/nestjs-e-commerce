import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { CollectionsModule } from 'src/collections/collections.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => CollectionsModule),
    PaginationModule,
    CategoriesModule,
    ProductVariantsModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}

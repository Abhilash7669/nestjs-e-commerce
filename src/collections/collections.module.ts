import { forwardRef, Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './providers/collections.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Collection,
  CollectionSchema,
} from 'src/collections/schema/collections.schema';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    forwardRef(() => ProductsModule),
  ],
})
export class CollectionsModule {}

import { Module } from '@nestjs/common';
import { ProductListingsController } from './product-listings.controller';
import { ProductListingsService } from './providers/product-listings.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductListing,
  ProductListingSchema,
} from 'src/product-listings/schema/product-listing.schema';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [ProductListingsController],
  providers: [ProductListingsService],
  imports: [
    MongooseModule.forFeature([
      { name: ProductListing.name, schema: ProductListingSchema },
    ]),
    PaginationModule,
  ],
  exports: [ProductListingsService],
})
export class ProductListingsModule {}

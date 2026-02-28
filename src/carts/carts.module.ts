import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './providers/carts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/carts/schema/cart.schema';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductVariantsModule,
  ],
})
export class CartsModule {}

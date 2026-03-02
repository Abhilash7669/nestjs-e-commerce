import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { CatsModule } from 'src/cats/cats.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';
import { CollectionsModule } from 'src/collections/collections.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { MenusModule } from 'src/menus/menus.module';
import { HomeModule } from 'src/home/home.module';
import { ProductListingsModule } from 'src/product-listings/product-listings.module';
import { CartsModule } from 'src/carts/carts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    CatsModule,
    ProductsModule,
    ProductVariantsModule,
    CollectionsModule,
    CategoriesModule,
    CartsModule,
    MenusModule,
    AuthModule,
    HomeModule,
    ProductListingsModule,
    MongooseModule.forRoot(
      'mongodb+srv://abhilashsk1998:weIlcm4nc2Xk94b6@cluser0.1tmh6.mongodb.net/chic_ecomm?retryWrites=true&w=majority&appName=Cluser0',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

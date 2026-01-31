import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { CatsModule } from 'src/cats/cats.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductVariantsModule } from 'src/product-variants/product-variants.module';
import { CollectionsModule } from 'src/collections/collections.module';

@Module({
  imports: [
    UsersModule,
    CatsModule,
    ProductsModule,
    ProductVariantsModule,
    CollectionsModule,
    MongooseModule.forRoot(
      'mongodb+srv://abhilashsk1998:weIlcm4nc2Xk94b6@cluser0.1tmh6.mongodb.net/chic_ecomm?retryWrites=true&w=majority&appName=Cluser0',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

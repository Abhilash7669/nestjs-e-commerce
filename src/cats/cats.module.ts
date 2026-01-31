import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from 'src/cats/provider/cats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/cats/schemas/cat.schema';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
})
export class CatsModule {}

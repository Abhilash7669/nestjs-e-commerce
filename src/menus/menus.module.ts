import { Module } from '@nestjs/common';
import { MenusController } from './menus.controller';
import { MenusService } from './providers/menus.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { CollectionsModule } from 'src/collections/collections.module';

@Module({
  controllers: [MenusController],
  providers: [MenusService],
  imports: [CategoriesModule, CollectionsModule],
})
export class MenusModule {}

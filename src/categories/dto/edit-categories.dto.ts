import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesDto } from 'src/categories/dto/create-categories.dto';

export class EditCategoriesDto extends PartialType(CreateCategoriesDto) {}

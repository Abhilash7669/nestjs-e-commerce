import { PartialType } from '@nestjs/mapped-types';
import { CreateCatsDto } from 'src/cats/dto/create-cats.dto';

/**
 * UpdateCatDto
 * Partial Type of CreateCatsDto
 */
export class UpdateCatDto extends PartialType(CreateCatsDto) {}

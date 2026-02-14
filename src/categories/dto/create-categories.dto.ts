import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriesDto {
  @ApiProperty({
    name: 'name',
    example: 'Saree',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

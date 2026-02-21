import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCategoriesDto {
  @ApiProperty({
    name: 'name',
    example: 'Saree',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    name: 'description',
    example: 'This is some description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    name: 'imageUrl',
    example: 'some image url',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

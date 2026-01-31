import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionsDto {
  @ApiProperty({
    name: 'name',
    example: 'Kinav Summer Collection',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    name: 'description',
    example: 'This is description for Kinav Summer Collection',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

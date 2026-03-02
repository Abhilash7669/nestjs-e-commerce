import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    example: 'abhilashsk1998@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    example: 'Kaizen47$',
  })
  password: string;
}

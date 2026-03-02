import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { userRoles } from 'src/users/enums/users-role.enum';

export class CreateUsersWithPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'email',
    required: true,
    default: 'abhilashsk1998@gmail.com',
  })
  email: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    name: 'phone',
    required: true,
    default: 9995410442,
  })
  phone: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'address',
    required: true,
    default: 'Poojapura, Mudavanmugal, South Road',
  })
  address: string;

  @IsEnum(userRoles)
  @ApiProperty({
    name: 'role',
    enum: userRoles,
    default: userRoles.GUEST,
  })
  role: userRoles;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'password',
    required: true,
    default: 'Kaizen47$',
  })
  password: string;
}

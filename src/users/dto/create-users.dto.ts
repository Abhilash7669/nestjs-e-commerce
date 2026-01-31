import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { userRoles } from 'src/users/enums/users-role.enum';

export class CreateUsersDto {
  @ApiPropertyOptional({
    name: 'Name',
    default: 'Abhilash SK',
    example: 'Abhilash',
  })
  name?: string;

  @ApiProperty({
    name: 'Phone',
    required: true,
    default: 9995410442,
  })
  phone: number;

  @ApiProperty({
    name: 'Email',
    required: true,
    default: 'abhilashsk1998@gmail.com',
  })
  email: string;

  @ApiProperty({
    name: 'Address',
    required: true,
    default: 'Poojapura, Mudavanmugal, South Road',
  })
  address: string;

  @ApiProperty({
    enum: userRoles,
  })
  role: userRoles;
}

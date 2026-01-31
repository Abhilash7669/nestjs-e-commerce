import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';

// @ApiTags('chic-users')
@Controller('users')
export class UsersController {
  @Get('/')
  async findAll(): Promise<string> {
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    return 'All users';
  }

  @Post('/')
  @ApiBody({ type: CreateUsersDto })
  async createUser(@Body() createUsersDto: CreateUsersDto) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return createUsersDto;
  }
}

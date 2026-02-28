import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { UsersService } from 'src/users/providers/users.service';

// @ApiTags('chic-users')
@Controller('users')
export class UsersController {
  constructor(
    /**
     * Dep Inject User service
     */
    private usersService: UsersService,
  ) {}

  @Get('/')
  async findAll() {
    return await this.usersService.getUsers();
  }

  @Post('/')
  @ApiBody({ type: CreateUsersDto })
  async createUser(@Body() createUsersDto: CreateUsersDto) {
    return await this.usersService.createUser(createUsersDto);
  }
}

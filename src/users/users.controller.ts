import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { CreateUsersWithPasswordDto } from 'src/users/dto/create-users-with-password.dto';
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
  @ApiBody({ type: CreateUsersWithPasswordDto })
  async createUser(
    @Body() createUsersWithPasswordDto: CreateUsersWithPasswordDto,
  ) {
    return await this.usersService.createUserWithPassword(
      createUsersWithPasswordDto,
    );
  }
}

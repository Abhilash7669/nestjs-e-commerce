import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserSignInDto } from 'src/auth/dto/user-sign-in.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthService } from 'src/auth/providers/auth.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * DI authService
     */
    private authService: AuthService,
  ) {}
  @Post('/sign-in')
  @ApiOperation({
    description: 'User Sign in',
  })
  signIn(@Body() userSignInDto: UserSignInDto) {
    return this.authService.signIn(userSignInDto);
  }

  @UseGuards(AuthGuard)
  @Get('/verify')
  @ApiOperation({
    description: 'Verify User',
  })
  verify(@User('email') user: string) {
    return {
      authenticated: true,
      user,
    };
  }
}

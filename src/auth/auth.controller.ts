import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserSignInDto } from 'src/auth/dto/user-sign-in.dto';
import { AuthService } from 'src/auth/providers/auth.service';

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
}

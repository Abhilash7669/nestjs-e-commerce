import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants/jwt.constants';
import { UserSignInDto } from 'src/auth/dto/user-sign-in.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject forwardRef usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * DI hashingProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * DI jwtService
     */
    private readonly jwtService: JwtService,
  ) {}
  async signIn(
    userSignInDto: UserSignInDto,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.getUserByEmail(userSignInDto.email);
    console.log(userSignInDto, 'HIT');
    if (!user) throw new NotFoundException('Invalid Credentials');

    // compare password
    const isAuthenticated = await this.hashingProvider.checkPassword(
      userSignInDto.password,
      user.password!,
    );

    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // issue JWT
    const payload = { sub: user._id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: jwtConstants.secret,
    });

    return {
      access_token,
    };
  }
}

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { CreateUsersWithPasswordDto } from 'src/users/dto/create-users-with-password.dto';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject User model
     */
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    /**
     * DI hashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  /**
   * TODO: Plan to create user by sending OTP to email, for now use password method
   * Creates a single user
   * @param createUsersDto
   * @returns Created User
   */
  async createUser(createUsersDto: CreateUsersDto) {
    try {
      const userExists = await this.userModel.findOne({
        phone: createUsersDto.phone,
        email: createUsersDto.email,
      });

      if (userExists) {
        throw new BadRequestException(
          'User with same phone and email already exists',
        );
      }

      const user = new this.userModel(createUsersDto);

      return await user.save();
    } catch (error) {
      console.log(error, 'ERROR');
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async createUserWithPassword(
    createUsersWithPasswordDto: CreateUsersWithPasswordDto,
  ) {
    try {
      const userExists = await this.userModel.findOne({
        email: createUsersWithPasswordDto.email,
      });

      if (userExists) {
        throw new BadRequestException(
          'User with same phone and email already exists',
        );
      }

      const hashedPassword = await this.hashingProvider.hashPassword(
        createUsersWithPasswordDto.password,
      );

      const user = new this.userModel({
        ...createUsersWithPasswordDto,
        password: hashedPassword,
      });

      return await user.save();
    } catch (error) {
      console.log(error, 'ERROR');
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Finds all Users
   * todo: paginate it
   * @returns List of Users
   */
  async getUsers() {
    const users = await this.userModel.find();

    if (!users) throw new NotFoundException('No users found');
    return users;
  }

  /**
   * Finds a User by Email
   * @param email
   * @returns User
   */
  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).lean();

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    return user;
  }
}

import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateCatsDto } from 'src/cats/dto/create-cats.dto';
import { UpdateCatDto } from 'src/cats/dto/update-cat.dto';
import { Cats } from 'src/cats/interface/cats.interface';
import { Cat, CatDocument } from 'src/cats/schemas/cat.schema';

@Injectable()
export class CatsService {
  constructor(
    @InjectModel(Cat.name) private catModel: Model<CatDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  private readonly cats: Cats[] = [
    {
      age: 28,
      breed: 'Kozhi',
      name: 'Abhin',
    },
  ];

  /**
   * Create a cat
   * @param createCatDto
   */
  async create(createCatsDto: CreateCatsDto) {
    const session = await this.connection.startSession();
    session.startTransaction();
    this.cats.push(createCatsDto);
    try {
      const createdCat = new this.catModel(createCatsDto);
      await session.commitTransaction();
      return createdCat.save();
    } catch {
      await session.abortTransaction();
      throw new RequestTimeoutException('Something went wrong');
    } finally {
      await session.endSession();
    }
  }

  /**
   * Dummy Update Service method
   * @param updateCatDto
   * @returns Updated Cat
   */
  updateOne(updateCatDto: UpdateCatDto) {
    return updateCatDto;
  }

  /**
   * Finds all cats
   * @returns All Cats
   */
  async findAll() {
    const cats = await this.catModel.find({}, { _id: 0 }).limit(10).lean();
    return cats;
  }
}

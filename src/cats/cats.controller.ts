import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateCatsDto } from 'src/cats/dto/create-cats.dto';
import { UpdateCatDto } from 'src/cats/dto/update-cat.dto';
import { CatsService } from 'src/cats/provider/cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  /**
   * Finds all cat
   * @returns All Cats
   */
  @Get('/')
  findAll() {
    return this.catsService.findAll();
  }

  /**
   * Create a cat
   * @param createCatsDto
   * @returns Created Cat
   */
  @Post('/')
  create(@Body() createCatsDto: CreateCatsDto) {
    return this.catsService.create(createCatsDto);
  }

  /**
   * Updates a cat
   * @param updateCatDto
   * @returns Updated Cat
   */
  @Put('/')
  updateOne(@Body() updateCatDto: UpdateCatDto) {
    return this.catsService.updateOne(updateCatDto);
  }
}

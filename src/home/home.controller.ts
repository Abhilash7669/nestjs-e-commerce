import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { HomeService } from 'src/home/providers/home.service';

@Controller('home')
export class HomeController {
  constructor(
    /**
     * DI home service/provider
     */
    private readonly homeService: HomeService,
  ) {}

  /**
   * @method GET
   * @public
   * @returns Top 3 latest collection
   */
  @Get('/')
  @ApiOperation({
    description: 'Gets Top 3 latest collection',
  })
  getHomeData() {
    console.log('HIT');
    return this.homeService.getHomeData();
  }
}

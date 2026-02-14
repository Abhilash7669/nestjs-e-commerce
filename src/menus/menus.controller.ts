import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MenusService } from 'src/menus/providers/menus.service';

@Controller('menus')
export class MenusController {
  constructor(
    /**
     * Dep injecting menusService
     */
    private readonly menusService: MenusService,
  ) {}

  /**
   * @public
   * @returns Data for the Main Mneu
   */
  @Get('/')
  @ApiOperation({
    description: 'Fetches the data for the main menu',
  })
  getMainMenu() {
    return this.menusService.getMainMenu();
  }
}

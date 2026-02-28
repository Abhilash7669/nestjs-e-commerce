import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { UpdateCartDto } from 'src/carts/dto/update-cart.dto';
import { CartsService } from 'src/carts/providers/carts.service';

@Controller('carts')
export class CartsController {
  constructor(
    // Dep Inject CartsService
    private readonly cartsService: CartsService,
  ) {}

  @Put('/')
  updateCart(@Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.updateCart(updateCartDto);
  }

  @Get('/:cartId')
  @ApiOperation({
    description: 'Retrieves a cart',
  })
  @ApiParam({
    name: 'cartId',
    required: true,
  })
  getCart(@Param('cartId') cartId: string) {
    return this.cartsService.getCart(cartId);
  }
}

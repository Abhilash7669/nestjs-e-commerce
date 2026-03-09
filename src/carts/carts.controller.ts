import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { OptionalGetCartAuthGuard } from 'src/auth/guard/optional-get-auth.guard';
import { UpdateCartDto } from 'src/carts/dto/update-cart.dto';
import { CartsService } from 'src/carts/providers/carts.service';
import { GetCartId } from 'src/common/decorators/get-cart-id.decorator';
import { User } from 'src/common/decorators/user.decorator';

@Controller('carts')
export class CartsController {
  constructor(
    // Dep Inject CartsService
    private readonly cartsService: CartsService,
  ) {}

  /**
   * Extracts user id and cart id from request via custom decorator
   * and loosely implemented auth guard
   * @param userId
   * @param cartId
   * @param updateCartDto
   * @returns Updated Cart
   */
  @UseGuards(OptionalGetCartAuthGuard)
  @Put('/')
  updateCart(
    @User('sub') userId: string,
    @GetCartId() cartId: string,
    @Body() updateCartDto: Omit<UpdateCartDto, 'cartId' | 'userId'>,
  ) {
    return this.cartsService.updateCart({
      ...updateCartDto,
      cartId,
      userId,
    });
  }

  @UseGuards(OptionalGetCartAuthGuard)
  @Get('/me')
  @ApiOperation({
    description: 'Retrieves a cart',
  })
  @ApiParam({
    name: 'cartId',
    required: true,
  })
  getCart(@User('sub') userId: string, @GetCartId() cartId?: string) {
    return this.cartsService.getUserCart(userId, cartId);
  }
}

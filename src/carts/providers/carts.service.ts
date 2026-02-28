import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateCartDto } from 'src/carts/dto/update-cart.dto';
import { Cart, CartDocument } from 'src/carts/schema/cart.schema';
import { applyVariantDiscount } from 'src/product-variants/domain/pricing/applyVariantDiscount';
// import { ProductVaraintsDiscountEnum } from 'src/product-variants/enum/product-variants-discount.enum';
import { ProductVariantsService } from 'src/product-variants/providers/product-variants.service';

@Injectable()
export class CartsService {
  constructor(
    /**
     * Inject Cart Model
     */
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,

    /**
     * Dep Inject productVariantsService
     */
    private readonly productVariantsService: ProductVariantsService,
  ) {}

  /**
   * Gets a single cart
   * @param cartId
   * @returns Cart
   */
  async getCart(cartId: string) {
    try {
      const cart = await this.cartModel
        .findOne({
          _id: new Types.ObjectId(cartId),
        })
        .populate('items.productId', 'name previewImageUrl')
        .populate('items.productVariantId', 'name attribute sku price images');

      if (!cart) throw new NotFoundException('Cart not found');
      return cart;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`${error.message}`);
      }
      throw error;
    }
  }

  /**
   * TODO: re-factor to a factory design
   * Updates Cart
   * @param cartData
   * @returns Cart
   */
  async updateCart(cartData: UpdateCartDto): Promise<CartDocument | boolean> {
    // first time cart - no cartId, no userId
    // hasCart but not logged in cartId, no userId

    // first time cart
    if (!cartData.cartId) {
      const productVariant = await this.productVariantsService.findVariantBySku(
        cartData.sku,
      );

      const itemPrice = applyVariantDiscount(
        productVariant.discount,
        productVariant.price,
      );

      const totalPrice = itemPrice * cartData.quantity;

      const createdCart = await this.cartModel
        .findOneAndUpdate(
          {
            userId: cartData.userId,
          },
          {
            items: [
              {
                productId: productVariant.productId?._id,
                productVariantId: productVariant._id,
                quantity: cartData.quantity,
              },
            ],
            totalPrice,
            totalQuantity: cartData.quantity,
          },
          {
            upsert: true,
            new: true,
          },
        )
        .populate('items.productId', 'name previewImageUrl')
        .populate('items.productVariantId', 'name attribute sku price images');

      return createdCart;
    }

    if (cartData.cartId) {
      /**
       * Find cart
       * get items
       * calculate item for increased/decreased quantity of item
       *  - can be 0
       *  - can be > 0
       *
       * Update items
       * Update Total Quantity
       * Update Total Price
       */
      const cart = await this.cartModel
        .findOne({
          _id: new Types.ObjectId(cartData.cartId),
        })
        .populate('items.productId', '_id')
        .populate('items.productVariantId', 'sku');

      if (!cart) throw new NotFoundException('Cart not found');

      const productVariant = await this.productVariantsService.findVariantBySku(
        cartData.sku,
      );

      if (!productVariant) {
        throw new NotFoundException('Product Variant not found');
      }

      const itemPrice = applyVariantDiscount(
        productVariant.discount,
        productVariant.price,
      );

      // always save userId
      cart.userId = cartData.userId
        ? new Types.ObjectId(cartData.userId)
        : undefined;

      // finding the Targeted product Variant
      const targetItem = cart?.items.filter(
        (item) =>
          item.productVariantId._id.toString() ===
          productVariant._id.toString(),
      )[0];

      // appending new item to cart
      if (!targetItem) {
        cart.items.push({
          productId: productVariant.productId!._id,
          productVariantId: productVariant._id,
          quantity: cartData.quantity,
        });
        const addedPrice = itemPrice * cartData.quantity;
        cart.totalPrice = cart.totalPrice + addedPrice;
        cart.totalQuantity = cart.totalQuantity + cartData.quantity;
        await cart.save();

        await cart.populate([
          {
            path: 'items.productId',
            select: 'name previewImageUrl',
          },
          {
            path: 'items.productVariantId',
            select: 'name attribute sku price images',
          },
        ]);
        return cart;
      }

      // prev quantity existing in cart
      const prevQuantity = targetItem.quantity;

      // prev price existing in cart
      const prevPrice = itemPrice * prevQuantity;

      // removing item from cart
      if (cartData.quantity === 0) {
        const updatedCartItem = cart.items.filter(
          (item) =>
            item.productVariantId._id.toString() !==
            productVariant._id.toString(),
        );
        cart.totalQuantity = cart.totalQuantity - prevQuantity;
        cart.totalPrice = cart.totalPrice - prevPrice;

        if (updatedCartItem.length === 0) {
          await this.cartModel.deleteOne({
            _id: new Types.ObjectId(cart._id),
          });

          return false;
        }

        cart.items = updatedCartItem;

        await cart.save();

        await cart.populate([
          {
            path: 'items.productId',
            select: 'name previewImageUrl',
          },
          {
            path: 'items.productVariantId',
            select: 'name attribute sku price images',
          },
        ]);
        return cart;
      }

      // increment/decrement from cart
      /**
       * update quantity
       * update totalPrice5
       */

      const newItemPrice = cartData.quantity * itemPrice;

      // update quantity for item
      const updatedCartItems = cart.items.map((item) => {
        if (
          item.productVariantId._id.toString() === productVariant._id.toString()
        ) {
          return {
            ...item,
            quantity: cartData.quantity,
          };
        }
        return item;
      });

      // increment/decrement totalPrice
      // decrement
      if (prevQuantity > cartData.quantity) {
        cart.totalPrice = cart.totalPrice - (prevPrice - newItemPrice);
        cart.totalQuantity =
          cart.totalQuantity - (prevQuantity - cartData.quantity);
        /**
         * total = 7
         * prev 2
         * current 1
         * total = 7 - (2-1)
         * = 6
         */
      }

      // increment
      if (prevQuantity < cartData.quantity) {
        cart.totalPrice = cart.totalPrice - prevPrice + newItemPrice;
        cart.totalQuantity =
          cart.totalQuantity - prevQuantity + cartData.quantity;
      }

      cart.items = updatedCartItems;
      await cart.save();

      await cart.populate([
        {
          path: 'items.productId',
          select: 'name previewImageUrl',
        },
        {
          path: 'items.productVariantId',
          select: 'name attribute sku price images',
        },
      ]);
      return cart;
    }
    return true;
  }
}

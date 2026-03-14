import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { UpdateCartDto } from 'src/carts/dto/update-cart.dto';
import { discountedPriceChecker } from 'src/carts/helper/discounted-price-checker.helper';
import { recalculateCart } from 'src/carts/helper/recalculate-cart.helper';
import { updateExistingCartItems } from 'src/carts/helper/update-cart.helper';
import { IPopulateCartItem } from 'src/carts/interface/populate-cart-item.interface';
import { CartItem } from 'src/carts/schema/cart-item.schema';
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
  async getCart(filter: QueryFilter<CartDocument>) {
    try {
      const cart = await this.cartModel
        .findOne(filter)
        .populate('items.productId', 'name previewImageUrl')
        .populate('items.productVariantId', 'name attribute sku price images')
        .lean();

      if (!cart) throw new NotFoundException('Cart not found');
      return cart;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`${error.message}`);
      }
      throw error;
    }
  }

  // user related methods

  /**
   * Gets a Users cart
   * @param userId
   * @param cartId
   * @returns Users cart | null
   */
  async getUserCart(
    userId?: string,
    cartId?: string,
  ): Promise<CartDocument | null> {
    if (userId && userId !== undefined) {
      return await this.getUserCartByUserId(userId);
    }

    if (cartId && cartId !== undefined) {
      return await this.getUserCartByCartId(cartId);
    }

    if (userId && cartId) {
      return await this.getUserCartByCartIdUserId({ cartId, userId });
    }
    return null;
  }

  async getUserCartByUserId(userId: string) {
    return await this.getCart({ userId: new Types.ObjectId(userId) });
  }

  async getUserCartByCartId(cartId: string) {
    return await this.getCart({ _id: new Types.ObjectId(cartId) });
  }

  async getUserCartByCartIdUserId(ids: { cartId: string; userId: string }) {
    return await this.cartModel.findOne({
      _id: new Types.ObjectId(ids.cartId),
      userId: new Types.ObjectId(ids.userId),
    });
  }

  /**
   * TODO: re-factor to a factory design
   * Updates Cart
   * @param cartData
   * @returns Cart
   */
  async updateCart(
    cartData: UpdateCartDto,
  ): Promise<CartDocument | { items: [] }> {
    const { quantity, sku, cartId, userId } = cartData;
    console.log(cartData, 'CARTDATA HERE');

    // ===== USER SCENARIOS ======== //
    /**
     * Fresh user
     *  - no user id
     *  - no cart id
     *
     * Logged out user
     *  - no user id
     *  - may or may not have a cart in db
     *
     * Logged in user
     *  - has user id
     *  - may or may not have a cart in db
     */
    // ===== USER SCENARIOS END ======== //
    // ===== CART UPDATE LOGIC ======== //
    /**
     * First HIT
     * Increment items
     *  - Re-calculate whole cart
     * Decrement items
     *  - Re-calculate whole cart
     * Empty cart
     *  - Delete cart
     */
    // ===== CART UPDATE LOGIC END ======== //

    // TODO: Handle when appending existing item again with 1
    // find if exists and if quantity 1 then append to it

    /**
     * First HIT
     * Fresh user
     */
    if (!cartId && !userId) {
      // find items in db with sku

      const productVariant =
        await this.productVariantsService.findVariantBySku(sku);

      // calculate price of product using applyDiscount

      const discountedPrice = applyVariantDiscount({
        basePrice: productVariant.price,
        discount: productVariant.discount,
        quantity,
      });

      // calculate necessary values for creating cart
      try {
        const cart = new this.cartModel({
          totalQuantity: quantity,
          totalPrice: discountedPrice * quantity,
          items: [
            {
              productId: productVariant.productId?._id,
              productVariantId: productVariant._id,
              quantity,
              discountedPrice: discountedPriceChecker(
                discountedPrice,
                productVariant.price,
              ),
            },
          ],
          userId: undefined,
        });
        await cart.save();
        return await cart.populate([
          {
            path: 'items.productId',
            select: 'name previewImageUrl',
          },
          {
            path: 'items.productVariantId',
            select: 'name attribute sku price images',
          },
        ]);
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequestException(error.message);
        }
        throw error;
      }
    }

    /**
     * Has CartId
     */
    if ((cartId && !userId) || (cartId && userId)) {
      // check if cart exists in db
      const cart = await this.cartModel
        .findById(new Types.ObjectId(cartId))
        .populate('items.productId', 'name previewImageUrl')
        .populate(
          'items.productVariantId',
          'name attribute sku price images discount',
        );

      if (!cart) throw new NotFoundException('Cart not found');

      // top level userId check
      if (userId) cart.userId = new Types.ObjectId(userId);

      // get items from db
      const productVariant =
        await this.productVariantsService.findVariantBySku(sku);

      if (!productVariant)
        throw new NotFoundException('Product variant not found');

      // increment/decrement
      if (quantity !== 0) {
        // need to differentiate existing and new item
        const itemExists = cart.items.find(
          (item) =>
            item.productVariantId._id.toString() ===
            productVariant._id.toString(),
        );

        if (!itemExists) {
          // discounted price if any
          const discountedPrice = applyVariantDiscount({
            basePrice: productVariant.price,
            discount: productVariant.discount,
            quantity,
          });
          // appending new item to cart
          // NOTE: exclamation on _id
          cart.items.push({
            productId: new Types.ObjectId(productVariant.productId!._id),
            productVariantId: new Types.ObjectId(productVariant._id),
            quantity: quantity,
            discountedPrice: discountedPriceChecker(
              discountedPrice,
              productVariant.price,
            ),
          });

          // TODO: is there a better way?
          await cart.populate([
            {
              path: 'items.productId',
              select: 'name previewImageUrl',
            },
            {
              path: 'items.productVariantId',
              select: 'name attribute sku price images discount',
            },
          ]);

          // type cast cart items directly
          const { totalPrice, totalQuantity } = recalculateCart(
            cart.items as unknown as IPopulateCartItem[],
          );
          cart.totalPrice = totalPrice;
          cart.totalQuantity = totalQuantity;

          return await cart.save();
        }

        // helper function -> update cart item -> type casted
        const discountedPrice = applyVariantDiscount({
          basePrice: productVariant.price,
          discount: productVariant.discount,
          quantity,
        });
        const updatedItems = updateExistingCartItems({
          items: cart.items as IPopulateCartItem[],
          newQuantity: quantity,
          productVariant,
          discountedPrice: discountedPriceChecker(
            discountedPrice,
            productVariant.price,
          ),
        });

        // assign cart items and type-cast
        cart.items = updatedItems as unknown as CartItem[];

        // re-calculate cart
        const { totalPrice, totalQuantity } = recalculateCart(updatedItems);
        cart.totalPrice = totalPrice;
        cart.totalQuantity = totalQuantity;
        return await cart.save();
      }
      // if zero - check if empty or not
      else {
        const updatedItems = cart.items.filter(
          (item) =>
            item.productVariantId._id.toString() !==
            productVariant._id.toString(),
        ) as IPopulateCartItem[];

        // cart is empty
        if (updatedItems.length === 0) {
          await cart.deleteOne();
          return {
            items: [],
          };
        }
        // re-calculate cart
        const { totalPrice, totalQuantity } = recalculateCart(updatedItems);
        cart.totalPrice = totalPrice;
        cart.totalQuantity = totalQuantity;
        cart.items = updatedItems as unknown as CartItem[];

        return await cart.save();
      }
    }

    // default response
    return {
      items: [],
    };
  }
}

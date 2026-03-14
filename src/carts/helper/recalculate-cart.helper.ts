import { ICartCalculate } from 'src/carts/interface/cart-calculate.interface';
import { IPopulateCartItem } from 'src/carts/interface/populate-cart-item.interface';
import { applyVariantDiscount } from 'src/product-variants/domain/pricing/applyVariantDiscount';

export function recalculateCart(items: IPopulateCartItem[]): ICartCalculate {
  const cartObject = {
    totalPrice: 0,
    totalQuantity: 0,
  } satisfies ICartCalculate;

  for (const item of items) {
    console.log(item, 'ITEM');
    const price = applyVariantDiscount(
      item.productVariantId?.discount || null,
      item.productVariantId.price,
    );
    cartObject.totalPrice = price * item.quantity + cartObject.totalPrice;
    cartObject.totalQuantity = item.quantity + cartObject.totalQuantity;
  }
  return {
    totalPrice: cartObject.totalPrice,
    totalQuantity: cartObject.totalQuantity,
  };
}

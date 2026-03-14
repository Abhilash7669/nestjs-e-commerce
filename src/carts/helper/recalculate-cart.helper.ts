import { ICartCalculate } from 'src/carts/interface/cart-calculate.interface';
import { IPopulateCartItem } from 'src/carts/interface/populate-cart-item.interface';
import { applyVariantDiscount } from 'src/product-variants/domain/pricing/applyVariantDiscount';

export function recalculateCart(items: IPopulateCartItem[]): ICartCalculate {
  const cartObject = {
    totalPrice: 0,
    totalQuantity: 0,
  } satisfies ICartCalculate;

  for (const item of items) {
    const price = applyVariantDiscount({
      basePrice: item.productVariantId.price,
      discount: item.productVariantId.discount || null,
      quantity: item.quantity,
    });
    cartObject.totalPrice = price + cartObject.totalPrice;
    cartObject.totalQuantity = item.quantity + cartObject.totalQuantity;
  }
  return {
    totalPrice: cartObject.totalPrice,
    totalQuantity: cartObject.totalQuantity,
  };
}

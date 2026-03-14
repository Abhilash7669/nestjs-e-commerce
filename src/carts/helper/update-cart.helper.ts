import { ICartUpdate } from 'src/carts/interface/cart-update.interface';
import { IPopulateCartItem } from 'src/carts/interface/populate-cart-item.interface';

export function updateCartItems({
  items,
  newQuantity,
  productVariant,
}: ICartUpdate): IPopulateCartItem[] {
  return items.map((item) => {
    if (
      item.productVariantId._id.toString() === productVariant._id.toString()
    ) {
      return {
        ...item,
        quantity: newQuantity,
      };
    }
    return item;
  });
}

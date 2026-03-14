import { ICartUpdate } from 'src/carts/interface/cart-update.interface';
import { IPopulateCartItem } from 'src/carts/interface/populate-cart-item.interface';

export function updateExistingCartItems({
  items,
  newQuantity,
  productVariant,
}: ICartUpdate): IPopulateCartItem[] {
  return items.map((item) => {
    if (
      item.productVariantId._id.toString() === productVariant._id.toString()
    ) {
      return {
        productId: item.productId,
        productVariantId: item.productVariantId,
        quantity: newQuantity,
      };
    } else {
      return {
        productId: item.productId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
      };
    }
  });
}

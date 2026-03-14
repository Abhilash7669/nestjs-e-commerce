import { ProductVaraintsDiscountEnum } from 'src/product-variants/enum/product-variants-discount.enum';
import { TApplyDiscount } from 'src/product-variants/types/variant-discount.type';

export function applyVariantDiscount({
  basePrice,
  discount,
  quantity,
}: TApplyDiscount) {
  console.log(discount, 'DISCOUNT');
  let discountedPrice = 0;
  if (!discount || discount.discountType === ProductVaraintsDiscountEnum.NONE) {
    return basePrice * quantity;
  }

  if (discount.discountType === ProductVaraintsDiscountEnum.FLAT) {
    console.log(';HERE?');
    discountedPrice = (basePrice - discount.value) * quantity;
  }
  if (discount.discountType === ProductVaraintsDiscountEnum.PERCENTAGE) {
    discountedPrice =
      (basePrice - (discount.value / 100) * basePrice) * quantity;
  }
  console.log(discountedPrice, 'FINAL RETURN');

  return discountedPrice;
}

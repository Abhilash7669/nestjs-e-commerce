import { ProductVaraintsDiscountEnum } from 'src/product-variants/enum/product-variants-discount.enum';
import { VariantDiscount } from 'src/product-variants/types/variant-discount.type';

export function applyVariantDiscount(
  discount: VariantDiscount | null | undefined,
  basePrice: number,
) {
  let discountedPrice = 0;
  if (!discount || discount.discountType === ProductVaraintsDiscountEnum.NONE) {
    return basePrice;
  }

  if (discount.discountType === ProductVaraintsDiscountEnum.FLAT) {
    discountedPrice = basePrice - discount.value;
  }
  if (discount.discountType === ProductVaraintsDiscountEnum.PERCENTAGE) {
    discountedPrice = basePrice - (discount.value / 100) * basePrice;
  }

  return discountedPrice;
}

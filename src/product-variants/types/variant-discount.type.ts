import { ProductVaraintsDiscountEnum } from 'src/product-variants/enum/product-variants-discount.enum';

export type VariantDiscount = {
  discountType: ProductVaraintsDiscountEnum;
  value: number;
};

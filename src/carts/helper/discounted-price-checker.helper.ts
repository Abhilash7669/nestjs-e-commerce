export function discountedPriceChecker(
  discountedPrice: number,
  originalPrice: number,
) {
  if (discountedPrice === originalPrice) return 0;
  return discountedPrice;
}

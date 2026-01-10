// utils/calcPriceByRole.ts
export function calcPriceByRole(
  price: {
    base_price: number;
    profit_price: number;
    tax: number;
    shipping: number;
    discount_price: number;
  },
  role: "B2B" | "B2C"
) {
  const factor = role === "B2B" ? 0.5 : 1;

  const profit = price.profit_price * factor;
  const tax = price.tax * factor;
  const shipping = price.shipping * factor;
  const discount = price.discount_price * factor;

  const total = price.base_price + profit + tax + shipping - discount;

  return {
    base_price: price.base_price,
    profit_price: profit,
    tax,
    shipping,
    discount_price: discount,
    total_price: Number(total.toFixed(2)),
  };
}

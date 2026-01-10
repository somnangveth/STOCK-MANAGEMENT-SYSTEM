interface CalcB2BInput {
  base_price?: number;
  profit_price?: number;
  tax?: number;
  shipping?: number;
  discount_price?: number;
}

export function calcB2BPrice({
  base_price = 0,
  profit_price = 0,
  tax = 0,
  shipping = 0,
  discount_price = 0,
}: CalcB2BInput) {
  // 50% reduction
  const b2b_profit = profit_price * 0.5;
  const b2b_tax = tax * 0.5;
  const b2b_shipping = shipping * 0.5;
  const b2b_discount = discount_price * 0.5;

  const total = base_price + b2b_profit + b2b_tax + b2b_shipping - b2b_discount;

  return {
    profit_price: round(b2b_profit),
    tax: round(b2b_tax),
    shipping: round(b2b_shipping),
    discount_price: round(b2b_discount),
    total_price: round(total),
  };
}

/* ---------- helper ---------- */
function round(value: number) {
  return Number(value.toFixed(2));
}

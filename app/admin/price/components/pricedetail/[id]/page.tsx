"use client";

import { cn } from "@/lib/utils";
import { Price, Product } from "@/type/productType";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PriceDetailCatalog from "@/app/components/catalog/priceDetailCatalog";

/* ---------------- HELPERS ---------------- */

const half = (value?: number) => Number(((value ?? 0) * 0.5).toFixed(2));

/* ---------------- CALCULATOR ---------------- */

const calcPriceByRole = (price: Price, role: "B2B" | "B2C"): Price => {
  const base = price.base_price ?? 0;
  const profit = price.profit_price ?? 0;
  const tax = price.tax ?? 0;
  const shipping = price.shipping ?? 0;
  const discount = price.discount_price ?? 0;

  if (role === "B2B") {
    const total =
      base + half(profit) + half(tax) + half(shipping) - half(discount);

    return {
      ...price,
      profit_price: half(profit),
      tax: half(tax),
      shipping: half(shipping),
      discount_price: half(discount),
      total_price: Number(total.toFixed(2)),
    };
  }

  // ✅ B2C (same logic as PriceList)
  const total = base + profit + tax + shipping - discount;

  return {
    ...price,
    total_price: Number(total.toFixed(2)),
  };
};

export default function PriceDetailPage() {
  const params = useParams();
  const priceId = params.id as string;

  // ✅ MUST MATCH PriceList DEFAULT ROLE
  const role: "B2B" | "B2C" = "B2C";

  // -------- FETCH PRICE --------
  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ["price-detail", priceId],
    queryFn: async () => {
      const res = await fetch("/api/admin/fetchPrice");
      if (!res.ok) throw new Error("Failed to fetch price");
      return res.json();
    },
  });

  // -------- FETCH PRODUCTS --------
  const { data: products, isLoading: productLoading } = useQuery({
    queryKey: ["productsQuery"],
    queryFn: async () => {
      const res = await fetch("/api/admin/fetchProducts");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const isLoading = priceLoading || productLoading;

  // -------- EXTRACT PRICE --------
  const rawPrice: Price | undefined = Array.isArray(priceData)
    ? priceData.find((p: Price) => p.price_id === priceId)
    : priceData;

  // ✅ APPLY ROLE-BASED CALCULATION (UI ONLY)
  const price = rawPrice ? calcPriceByRole(rawPrice, role) : undefined;

  // -------- EXTRACT PRODUCT --------
  const product: Product | undefined = products?.find(
    (p: Product) => p.product_id === price?.product_id
  );

  // -------- LOADING --------
  if (isLoading) {
    return (
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p className="flex items-center gap-2">
          Loading <AiOutlineLoading3Quarters className={cn("animate-spin")} />
        </p>
      </div>
    );
  }

  // -------- NOT FOUND --------
  if (!price || !product) {
    return (
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p>Price detail not found</p>
      </div>
    );
  }

  // -------- UI --------

  const calculatedPrice = calcPriceByRole(price, role);

  return <PriceDetailCatalog price={calculatedPrice} product={product} />;
}

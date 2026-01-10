"use client";

import Link from "next/link";
import ProductTable, {
  type ColumnKey,
} from "@/app/components/Tables/productTable";
import { Price } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import UpdatePriceForm from "./updatePriceForm";
import CreatePriceForm from "./CreatePriceForm";
import DeletePrice from "./DeletePrice";
import { view } from "@/app/components/Icons";

/* ---------------- TYPES ---------------- */

export interface PriceProduct {
  product_id: string;
  sku_code: string;
  product_image: string;
  product_name: string;

  price_id?: string;

  base_price: number;
  profit_price: number;
  tax: number;
  shipping: number;
  discount_price: number;
  total_price: number;
}

interface PriceListProps {
  refreshKey: number;
  role: "B2B" | "B2C";
  registerSearch: (
    data: PriceProduct[],
    onSearch: (results: PriceProduct[]) => void,
    searchKeys: (keyof PriceProduct)[]
  ) => void;
}

/* ---------------- HELPERS ---------------- */

const half = (value?: number) => Number(((value ?? 0) * 0.5).toFixed(2));

/* ---------------- PRICE CALCULATOR ---------------- */

const calcPriceByRole = (
  price: {
    base_price: number;
    profit_price: number;
    tax: number;
    shipping: number;
    discount_price: number;
  },
  role: "B2B" | "B2C"
) => {
  if (role === "B2B") {
    const profit = half(price.profit_price);
    const tax = half(price.tax);
    const shipping = half(price.shipping);
    const discount = half(price.discount_price);

    const total = price.base_price + profit + tax + shipping - discount;

    return {
      profit_price: profit,
      tax,
      shipping,
      discount_price: discount,
      total_price: Number(total.toFixed(2)),
    };
  }

  const total =
    price.base_price +
    price.profit_price +
    price.tax +
    price.shipping -
    price.discount_price;

  return {
    profit_price: price.profit_price,
    tax: price.tax,
    shipping: price.shipping,
    discount_price: price.discount_price,
    total_price: Number(total.toFixed(2)),
  };
};

/* ---------------- COMPONENT ---------------- */

export default function PriceList({
  refreshKey,
  role,
  registerSearch,
}: PriceListProps) {
  /* ---------------- FETCHERS ---------------- */

  async function fetchPriceData() {
    const res = await fetch("/api/admin/fetchPrice");
    if (!res.ok) throw new Error("Failed to fetch price data");
    return res.json();
  }

  async function fetchProductData() {
    const res = await fetch("/api/admin/fetchProducts");
    if (!res.ok) throw new Error("Failed to fetch product data");
    return res.json();
  }

  const result = useQueries({
    queries: [
      { queryKey: ["product-query", refreshKey], queryFn: fetchProductData },
      { queryKey: ["price-query", refreshKey], queryFn: fetchPriceData },
    ],
  });

  const productData = result[0].data;
  const priceData = result[1].data;
  const isLoading = result[0].isLoading || result[1].isLoading;
  const error = result[0].error || result[1].error;

  /* ---------------- MERGE & CALCULATE ---------------- */

  const mergedData = useMemo<PriceProduct[]>(() => {
    if (!productData || !priceData) return [];

    return productData.map((product: any) => {
      const price = priceData.find(
        (p: any) => p.product_id === product.product_id
      );

      const base_price = price?.base_price ?? 0;
      const profit_price = price?.profit_price ?? 0;
      const tax = price?.tax ?? 0;
      const shipping = price?.shipping ?? 0;
      const discount_price = price?.discount_price ?? 0;

      const calculated = calcPriceByRole(
        {
          base_price,
          profit_price,
          tax,
          shipping,
          discount_price,
        },
        role
      );

      return {
        ...product,
        ...price,
        ...calculated,
      };
    });
  }, [productData, priceData, role]);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    registerSearch(mergedData, () => {}, ["product_name", "sku_code"]);
  }, [mergedData, registerSearch]);

  /* ---------------- COLUMNS ---------------- */

  const columns: ColumnKey[] = [
    "sku-code",
    "product_image",
    "product_name",
    "base_price",
    "profit_price",
    "tax",
    "shipping",
    "discount_price",
    "total_price",
    "action",
  ];

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return (
      <p className="text-gray-500 text-center p-8">Loading price data...</p>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load prices.</p>
        <button
          className="text-blue-600 underline"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="overflow-x-auto">
      <ProductTable
        itemsPerPage={10}
        product={mergedData}
        columns={columns}
        form={(price) => {
          const p = price as PriceProduct;

          return (
            <div className="flex items-center gap-2">
              {p.price_id ? (
                <UpdatePriceForm price={p as Price} />
              ) : (
                <CreatePriceForm
                  productId={String(p.product_id)}
                  productName={p.product_name}
                />
              )}

              <DeletePrice price={price as Price} />

              {p.price_id && (
                <Link
                  href={`/admin/price/components/pricedetail/${p.price_id}`}
                  className="w-10 h-5 bg-transparent text-gray-600"
                >
                  {view}
                </Link>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}

"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export default function AlertExpiredPanel() {
  async function fetchProducts() {
    const res = await fetch("/api/admin/fetchProducts");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }

  async function getExpiredProducts() {
    const res = await fetch("/api/admin/getExpiredProducts");
    if (!res.ok) throw new Error("Failed to fetch expired data");
    return res.json();
  }

  const result = useQueries({
    queries: [
      { queryKey: ["productsQuery"], queryFn: fetchProducts },
      { queryKey: ["expiredQuery"], queryFn: getExpiredProducts },
    ],
  });

  const productData = result[0].data;
  const expiredData = result[1].data;
  const isLoading = result[0].isLoading || result[1].isLoading;
  const hasError = result[0].error || result[1].error;

  const expiredProducts = useMemo(() => {
    if (!productData || !expiredData) return [];

    if (!Array.isArray(productData) || !Array.isArray(expiredData)) return [];

    // Unique product IDs that have expired batches
    const uniqueProductIds = [
      ...new Set(expiredData.map((b: any) => b.product_id)),
    ];

    return productData.filter((p: any) =>
      uniqueProductIds.includes(p.product_id)
    );
  }, [productData, expiredData]);

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error loading data</div>;

  return (
    <div className="space-y-1">
      {expiredProducts.length === 0 ? (
        <div className="text-gray-500 text-sm">No expired products found</div>
      ) : (
        expiredProducts.map((product: any) => {
          const batches = expiredData.filter(
            (batch: any) => batch.product_id === product.product_id
          );

          return (
            <div
              key={product.product_id}
              className="flex gap-2 p-2 border rounded-lg shadow-sm bg-white items-center"
            >
              <img src={product.product_image} alt={product.product_name}  className="w-10 h-10"/>
              <h3 className="text-gray-500 text-sm">{product.product_name}</h3>

              <p className="text-sm text-gray-600">{product.sku_code}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

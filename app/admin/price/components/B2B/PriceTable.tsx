"use client";
import ProductTable from "@/app/components/Tables/productTable";
import { fetchPricesB2B, fetchProducts } from "@/app/functions/admin/api/controller";
import { Price, Product } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import UpdatePriceFormB2B from "./UpdateForm";
import { PriceProductProps } from "../B2C/UpdateForm";
import { RetryButton } from "@/app/components/error/error";
import DiscountMultipleForm from "../components/DiscountForm";

export default function PriceTableB2B() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const result = useQueries({
    queries: [
      {
        queryKey: ['productQuery'],
        queryFn: fetchProducts,
      },
      {
        queryKey: ['priceQueryB2B'],
        queryFn: fetchPricesB2B,
      }
    ]
  });

  const productData = result[0].data;
  const priceData = result[1].data;
  const isLoading = result[0].isLoading || result[1].isLoading;
  const hasError = result[0].error || result[1].error;

  // Merge Price and Product Data 
  const PriceProductData = useMemo(() => {
    if (!priceData || !productData) return [];
    return productData.map((product: Product) => {
      const price = priceData.find((p: Price) => p.product_id === product.product_id);
      return {
        ...product,
        ...price,
      };
    });
  }, [priceData, productData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
      </div>
    );
  }

  if (hasError) {
    return <RetryButton />;
  }

  return (
    <div className="space-y-4">
      {/* Show discount button when products are selected */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedProducts.length} product(s) selected
          </span>
          <DiscountMultipleForm prices={selectedProducts as Price[]} />
        </div>
      )}

      <ProductTable
        product={PriceProductData}
        itemsPerPage={10}
        columns={['select', 'product_name', 'base_price', 'profit_price', 'shipping', 'action']}
        form={(item) => <UpdatePriceFormB2B priceData={item as PriceProductProps} />}
        onSelectionChange={(selected) => {
          setSelectedProducts(selected);
        }}
      />
    </div>
  );
}
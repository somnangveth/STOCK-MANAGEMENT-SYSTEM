"use client";
import { RetryButton } from "@/app/components/error/error";
import ProductTable from "@/app/components/Tables/productTable";
import { fetchPricesB2C, fetchProducts } from "@/app/functions/admin/api/controller";
import { Price, Product } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PriceProductProps } from "../B2C/UpdateForm";
import UpdatePriceFormB2C from "./UpdateForm";
import DiscountMultipleForm from "../components/DiscountForm";

export default function PriceTableB2C() {
  const [selectedProducts, setSelectedProducts] = useState<Price[]>([]);

  const result = useQueries({
    queries: [
      {
        queryKey: ["priceQueryB2C"],
        queryFn: fetchPricesB2C,
      },
      {
        queryKey: ['productQuery'],
        queryFn: fetchProducts,
      }
    ]
  });

  const priceData = result[0].data;
  const productData = result[1].data;
  const isLoading = result[0].isLoading || result[1].isLoading;
  const hasError = result[0].error || result[1].error;

  // Debug: Log the raw data
  console.log("Raw priceData:", priceData);
  console.log("Raw productData:", productData);

  // Merge product and price data
  const ProductPriceData = useMemo(() => {
    if (!priceData || !productData) return [];
    
    const merged = productData.map((product: Product) => {
      const price = priceData.find((p: Price) => p.product_id === product.product_id);
      
      // Debug: Log each merge
      console.log("Merging product:", product.product_id, "with price:", price);
      
      return {
        ...product,
        ...price,
      };
    });
    
    console.log("Merged ProductPriceData:", merged);
    return merged;
  }, [productData, priceData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">Error loading data</p>
        <RetryButton />
      </div>
    );
  }

   if (!priceData || !productData) {
  return <div>No product found</div>;
}


  // Debug: Log selected products
  console.log("Selected products:", selectedProducts);

  return (
    <div className="space-y-4">
      {/* Show discount button when products are selected */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <span className="text-sm font-medium text-blue-900">
              {selectedProducts.length} product(s) selected
            </span>
            {/* Debug info */}
            <div className="text-xs text-gray-600 mt-1">
              {selectedProducts.map((p: any, i) => (
                <div key={i}>
                  Product {i + 1}: price_id = {p.price_id || 'MISSING'}
                </div>
              ))}
            </div>
          </div>
          <DiscountMultipleForm prices={selectedProducts as Price[]} />
        </div>
      )}

      <ProductTable
        product={ProductPriceData}
        itemsPerPage={10}
        columns={['select', 'product_name', 'base_price', 'profit_price', 'shipping', 'action']}
        form={(item) => <UpdatePriceFormB2C priceData={item as PriceProductProps} />}
        onSelectionChange={(selected: any) => {
          console.log("Selection changed:", selected);
          setSelectedProducts(selected);
        }}
      />
    </div>
  );
}
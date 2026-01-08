"use client";

import ProductTable from "@/app/components/Tables/productTable";
import { fetchPricesB2B, fetchProducts } from "@/app/functions/admin/api/controller";
import { Price, Product } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import UpdatePriceFormB2B from "./UpdateForm";
import { RetryButton } from "@/app/components/error/error";
import DiscountMultipleForm from "../components/DiscountForm";
import { convertFromDollarToRiels } from "@/app/functions/admin/price/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewDiscountPage from "../components/ViewDiscount";
import SearchBar from "@/app/components/SearchBar";

export default function PriceTableB2B() {
  const [selectedProducts, setSelectedProducts] = useState<Price[]>([]);
  const [currency, setCurrency] = useState<"riel" | "dollar">("dollar");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const result = useQueries({
    queries: [
      { queryKey: ["productQuery"], queryFn: fetchProducts },
      { queryKey: ["priceQueryB2B"], queryFn: fetchPricesB2B },
    ],
  });

  const productData = result[0].data;
  const priceData = result[1].data;
  const isLoading = result[0].isLoading || result[1].isLoading;
  const hasError = result[0].error || result[1].error;

  const mergedData = useMemo(() => {
    if (!priceData || !productData) return [];

    return productData.map((product: Product) => {
      const price = priceData.find(
        (p: Price) => p.product_id === product.product_id
      );

      if (!price) {
        return { ...product, base_price: null, profit_price: null, shipping: null };
      }

      return {
        ...product,
        ...price,
        base_price:
          currency === "riel"
            ? convertFromDollarToRiels(price.base_price)
            : price.base_price,
        profit_price:
          currency === "riel"
            ? convertFromDollarToRiels(price.profit_price)
            : price.profit_price,
        shipping:
          currency === "riel"
            ? convertFromDollarToRiels(price.shipping)
            : price.shipping,
      };
    });
  }, [productData, priceData, currency]);

  // initialize search result
  useMemo(() => {
    setFilteredData(mergedData);
  }, [mergedData]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <AiOutlineLoading3Quarters className="animate-spin text-2xl" />
      </div>
    );
  }

  if (hasError) return <RetryButton />;

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex justify-between items-center">
        <SearchBar
          data={mergedData}
          onSearch={setFilteredData}
          searchKeys={["product_name"]}
          placeholder="Search product..."
          className="w-[300px]"
        />

        <div className="flex items-center gap-3">
          <Select value={currency} onValueChange={(v:any) => setCurrency(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dollar">USD ($)</SelectItem>
              <SelectItem value="riel">Riel (៛)</SelectItem>
            </SelectContent>
          </Select>

          {selectedProducts.length > 0 && (
            <DiscountMultipleForm prices={selectedProducts} />
          )}

          <ViewDiscountPage />
        </div>
      </div>

      <ProductTable
        product={filteredData}
        itemsPerPage={7}
        columns={["select", "product_name", "base_price", "profit_price", "shipping", "action"]}
        form={(item) => <UpdatePriceFormB2B priceData={item as Price} />}
        onSelectionChange={(selected: any) => {
          console.log("Selection changed:", selected);
          setSelectedProducts(selected);
        }}

      />
    </div>
  );
}

"use client";
import ReceiptCard from "@/app/components/catalog/ReceiptCard";
import ProductTable from "@/app/components/Tables/productTable";
import ReceiptB2C from "./ReceiptB2C";
import {
  fetchProducts,
  fetchSaleItems,
  fetchSales,
} from "@/app/functions/admin/api/controller";
import { Product, Sale } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

// ReceiptCard SaleItem type (combination of sale_item + product)
type SaleItem = {
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
  total: number;
  product_id?: string; 
};

export default function SaleTableB2C() {
  const result = useQueries({
    queries: [
      {
        queryKey: ["saleQuery"],
        queryFn: fetchSales,
      },
      {
        queryKey: ["productQuery"],
        queryFn: fetchProducts,
      },
      {
        queryKey: ["saleItemQuery"],
        queryFn: fetchSaleItems,
      },
    ],
  });

  const salesData = result[0].data as Sale[];
  const productData = result[1].data as Product[];
  const saleItemData = result[2].data as SaleItem[];

  const isLoading =
    result[0].isLoading || result[1].isLoading || result[2].isLoading;
  const hasError = result[0].error || result[1].error || result[2].error;

  //Filter Sale Data
  const saleData = useMemo(() => {
    if(!salesData) return [];
    return salesData.filter((sale: Sale) => sale.customertype === "General")
  }, [salesData]);

  // Create a product lookup map for efficient access
  const productMap = useMemo(() => {
    if (!productData) return {};
    return productData.reduce((acc: any, product: Product) => {
      acc[product.product_id] = product;
      return acc;
    }, {});
  }, [productData]);

  // Group saleItems by sale_id AND populate product data
  const saleItemsBySaleId = useMemo(() => {
    if (!saleItemData || !productMap) return {};
    
    return saleItemData.reduce((acc: any, item: any) => {
      acc[item.sale_id] = acc[item.sale_id] || [];
      
      // Ensure product data is populated
      const enrichedItem = {
        ...item,
        product: item.product || productMap[item.product_id] || {
          product_id: item.product_id,
          product_name: "Unknown Product",
          price: 0
        }
      };
      
      acc[item.sale_id].push(enrichedItem);
      return acc;
    }, {});
  }, [saleItemData, productMap]);

  // Enhance each sale with its items and item count
  const enhancedSales = useMemo(() => {
    if (!saleData || !saleItemsBySaleId) return [];
    
    return saleData.map((sale: Sale) => {
      const items = saleItemsBySaleId[sale.sale_id] || [];
      
      return {
        ...sale,
        items: items,
        itemCount: items.reduce((sum: number, item: SaleItem) => sum + (item.quantity || 0), 0),
      };
    });
  }, [saleData, saleItemsBySaleId]);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading sales data...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Error loading sales data. Please try again.</p>
      </div>
    );
  }

  // Debug: Log the first sale to see the data structure
  if (enhancedSales.length > 0) {
    console.log("First enhanced sale:", enhancedSales[0]);
    console.log("First sale items:", enhancedSales[0].items);
  }

  return (
    <ProductTable
      itemsPerPage={7}
      product={enhancedSales}
      columns={[
        "sale_id",
        "subtotal",
        "discount",
        "tax",
        "total_price",
        "payment_method",
        "status",
        "action",
      ]}
      form={(sale: any) => {
        // Get the first product from the sale items
        const firstProduct = sale.items?.[0]?.product || productData?.[0];
        
        // Debug log
        console.log("Sale for receipt:", sale);
        console.log("First product:", firstProduct);
        
        return (
          <ReceiptB2C 
            sale={sale} 
            product={firstProduct} 
          />
        );
      }}
    />
  );
}
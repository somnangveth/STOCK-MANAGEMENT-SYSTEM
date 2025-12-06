'use client';
import ProductTable from "@/app/components/Tables/productTable";
import { Product } from "@/type/productType";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import AddFormBatch from "./AddFormBatch";
import { view } from "@/app/components/Icons";
import Link from "next/link";

// Define enhanced product type
export interface EnhancedProduct extends Product {
  category_name?: string;
  subcategory_name?: string;
  batches?: any[];

}

export default function ProductList({ 
  refreshKey = 0,
  onDataLoaded
}: { 
  refreshKey?: number;
  onDataLoaded?: (
    data: EnhancedProduct[], 
    onSearch: (results: EnhancedProduct[]) => void,
    searchKeys: (keyof EnhancedProduct)[]
  ) => void;
}) {
  const [displayProducts, setDisplayProducts] = useState<EnhancedProduct[]>([]);

  const handleSearchResults = useCallback((results: EnhancedProduct[]) => {
    setDisplayProducts(results);
  }, []);

  async function fetchCategoryAndSubcategoryData() {
    const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
    if (!res.ok) throw new Error("Failed to fetch product data");
    return res.json();
  }

  async function fetchBatch(){
    const res = await fetch('/api/admin/fetchBatch');
    if(!res.ok){
      console.error('Failed to fetch batch datas');
      throw new Error("Failed to fetch");
    }
    return res.json();
  }

  const result = useQueries({
    queries: [
      {
        queryKey: ["products", refreshKey],
        queryFn: fetchCategoryAndSubcategoryData,
      },
      {
        queryKey: ["batchQuery"],
        queryFn: fetchBatch,
      }
    ]
  });

  const productData = result[0].data;
  const batchData = result[1].data;
  const isLoading = result[0].isLoading || result[1].isLoading;
  const error = result[0].error || result[1].error;

  const batchMap = useMemo(() => {
    if(!batchData) return {};

    const map: Record<string, any[]> = {};

    for(const b of batchData){
      if(!map[b.product_id]) map[b.product_id] = [];
      map[b.product_id].push(b);
    }

    return map;
  }, [batchData]);

  useEffect(() => {
    if (!productData) return;

    const categoryMap = new Map(
      productData.categories.map((cat: { category_id: string; category_name: string; }) => 
        [cat.category_id, cat.category_name]
      )
    );
    
    const subcategoryMap = new Map(
      productData.subcategories.map((sub: { subcategory_id: string; subcategory_name: string; }) => 
        [sub.subcategory_id, sub.subcategory_name]
      )
    );

    const enhancedProducts: EnhancedProduct[] = productData.product.map((product: Product) => {
      const productBatches = batchMap[product.product_id] || [];
      
      // Sort batches by expiry date (FEFO - First Expired, First Out)
      const sortedBatches = [...productBatches].sort((a, b) => 
        new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
      );

      // Get the oldest batch (will be sold first)
      const oldestBatch = sortedBatches[0];

      // Calculate total quantity remaining across all batches
      const totalQuantity = productBatches.reduce(
        (sum, batch) => sum + (batch.quantity_remaining || 0), 
        0
      );

      return {
        ...product,
        category_name: categoryMap.get(product.category_id) || 'Unknown',
        subcategory_name: subcategoryMap.get(product.subcategory_id) || 'Unknown',
        batches: productBatches,
        // Flatten batch data for table display
        manufacture_date: oldestBatch?.manufacture_date || 'N/A',
        quantity_remaining: totalQuantity, // Total across all batches
        batch_count: productBatches.length,
      };
    });

    setDisplayProducts(enhancedProducts);

    if (onDataLoaded) {
      const searchKeys: (keyof EnhancedProduct)[] = [
        'product_name',
        'sku_code',
        'category_name',
        'subcategory_name'
      ];
      onDataLoaded(enhancedProducts, handleSearchResults, searchKeys);
    }
  }, [productData, batchMap, onDataLoaded, handleSearchResults]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Failed to load products</p>
        <button 
          onClick={() => window.location.reload()} 
          className="ml-4 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (displayProducts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <ProductTable
        itemsPerPage={7}
        product={displayProducts}
        columns={[
          'product_image',
          'sku-code',     
          'product_name',
          'base_unit',
          'manufacture_date',
          'quantity_remaining',
          'action'
        ]}
        form={(product) => {
          const p = product as EnhancedProduct;
          return (
            <div className="flex items-center gap-2">
              <AddFormBatch product={p} />
              <Link href={`/admin/stock/components/batchdetail/${p.product_id}`}>
              {view}
              </Link>
            </div>
          );
        }}
      />
    </div>
  );
}
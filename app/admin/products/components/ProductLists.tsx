'use client';
import ProductTable from "@/app/components/Tables/productTable";
import { Product } from "@/type/productType";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import UpdateForm from "./UpdateForm";
import DeleteProduct from "./DeleteProduct";
import { Categories, Subcategories } from "@/type/productType";
import Link from "next/link";
import { view } from "@/app/components/Icons";

// Define enhanced product type
export interface EnhancedProduct extends Product {
  category_name?: string;
  subcategory_name?: string;
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

  // Memoized search handler
  const handleSearchResults = useCallback((results: EnhancedProduct[]) => {
    setDisplayProducts(results);
  }, []);

  // Fetch products data
  async function fetchProductData() {
    const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
    if (!res.ok) throw new Error("Failed to fetch product data");
    return res.json();
  }

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ["products", refreshKey],
    queryFn: fetchProductData,
  });

  // Process and enhance products when data changes
  useEffect(() => {
    if (!productData) return;

    // Create lookup maps for quick access
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

    // Enhance products with category and subcategory names
    const enhancedProducts: EnhancedProduct[] = productData.product.map((product: Product) => ({
      ...product,
      category_name: categoryMap.get(product.category_id) || 'Unknown',
      subcategory_name: subcategoryMap.get(product.subcategory_id) || 'Unknown'
    }));

    setDisplayProducts(enhancedProducts);

    // Notify parent component if callback provided
    if (onDataLoaded) {
      const searchKeys: (keyof EnhancedProduct)[] = [
        'product_name',
        'sku_code',
        'category_name',
        'subcategory_name'
      ];
      onDataLoaded(enhancedProducts, handleSearchResults, searchKeys);
    }
  }, [productData, onDataLoaded, handleSearchResults]);

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
        itemsPerPage={10}
        product={displayProducts}
        columns={[
          'product_image',
          'sku-code',     
          'product_name',
          'base_unit',
          'category_id',
          'subcategory_id',
          'action'
        ]}
        form={(product) => {
          const p = product as Product;
          return(
            <div className="flex items-center">
            <UpdateForm product={product as Product} />
            <DeleteProduct product={product as Product} />
            <Link href={`/admin/products/components/productdetail/${p.product_id}`}>{view}</Link>
            </div>
          )
        }}
      />
    </div>
  );
}
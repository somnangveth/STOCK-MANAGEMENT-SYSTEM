'use client';

import ProductTable from "@/app/components/Tables/productTable";
import { fetchProducts } from "@/app/functions/stock/product/product";
import { Product } from "@/type/productType";
import { useEffect, useState, useCallback } from "react";
import UpdateForm from "./UpdateForm";
import DeleteProduct from "./DeleteProduct";

export default function ProductList({ 
  refreshKey = 0,
  onDataLoaded
}: { 
  refreshKey?: number;
  onDataLoaded?: (
    data: Product[], 
    onSearch: (results: Product[]) => void,
    searchKeys: (keyof Product)[]
  ) => void;
}) {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized search handler
  const handleSearchResults = useCallback((results: Product[]) => {
    setDisplayProducts(results);
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const productData = await fetchProducts();

        setProducts(productData);
        setDisplayProducts(productData);

        // Provide search keys to parent (SearchBar)
        if (onDataLoaded) {
          onDataLoaded(
            productData,
            handleSearchResults,
            ['product_name', 'sku_code'] // IMPORTANT: real keys in Product interface
          );
        }

      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [refreshKey, onDataLoaded, handleSearchResults]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">{error}</p>
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
        products={displayProducts}
        columns={[
          'product_image',
          'sku-code',     
          'product_name',
          'base_unit',
          'category_id',
          'action'
        ]}
        form={(product) => (
          <>
            <UpdateForm product={product as Product} />
            <DeleteProduct product={product as Product} />
          </>
        )}
      />
    </div>
  );
}

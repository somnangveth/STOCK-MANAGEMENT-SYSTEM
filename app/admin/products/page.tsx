"use client";

import { useState, useCallback } from "react";
import SearchBar from "@/app/components/SearchBar";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductLists";
import { Product } from "@/type/productType";

export default function ProductManagement() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Store product list locally
  const [products, setProducts] = useState<Product[]>([]);

  // Store search configs coming from ProductList
  const [searchConfig, setSearchConfig] = useState<{
    searchKeys: (keyof Product)[];
    onSearch: (results: Product[]) => void;
  } | null>(null);

  /**
   * Called by ProductList when data is loaded
   */
  const registerSearch = useCallback(
    (
      data: Product[],
      onSearch: (results: Product[]) => void,
      searchKeys: (keyof Product)[]
    ) => {
      setProducts(data); // store product list
      setSearchConfig({ searchKeys, onSearch });
    },
    []
  );

  /**
   * When new product created → refresh ProductList
   */
  const handleProductAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-6 p-6">

      {/* Search bar shows only after ProductList registers keys */}
      {searchConfig && (
        <SearchBar
          data={products}
          onSearch={searchConfig.onSearch}
          searchKeys={searchConfig.searchKeys}
          placeholder="Search products by name, SKU, or category..."
        />
      )}

      {/* Add product form */}
      <ProductForm onProductAdded={handleProductAdded} />

      <div className="mt-10">
        {/* Product list */}
        <ProductList refreshKey={refreshKey} onDataLoaded={registerSearch} />
      </div>
    </div>
  );
}

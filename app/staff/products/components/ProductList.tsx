"use client";
import { PermissionGate } from "@/app/components/permission/PermissionGate";
import ProductTable from "@/app/components/Tables/productTable";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/type/productType";

// Define the API response type
type ProductResponse = {
  data: Product[];
  error: null | string;
};

export default function ProductList() {
  async function fetchProducts(): Promise<ProductResponse> {
    const res = await fetch('/api/staff/fetchProducts');
    if (!res.ok) {
      throw new Error("Failed to fetch product data");
    }
    return res.json();
  }

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["products-Query"],
    queryFn: fetchProducts,
  });

  return (
    <PermissionGate 
      permission="product.view"
      loadingFallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-gray-500">Checking permissions...</p>
        </div>
      }
      fallback={
        <>
        </>
      }
    >
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600 font-semibold mb-2">Failed to fetch products</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && response?.data && (
        <>
          {response.data.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <ProductTable
              product={response.data}
              columns={["sku-code", "product_name"]}
              itemsPerPage={7}
            />
          )}
        </>
      )}
    </PermissionGate>
  );
}
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
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg 
            className="w-16 h-16 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            You don't have permission to view products.
          </p>
        </div>
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
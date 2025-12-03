"use client";
import { Product } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";

type ProductAssociation = {
  association_id: string;
  product_id: string;
  associated_product_id: string;
  association_type: 'related' | 'bundle' | 'alternative';
  created_at: string;
};

export default function AssociatedCatalog() {
  async function fetchAssociations() {
    const res = await fetch("/api/admin/fetchAssociated");
    if (!res.ok) throw new Error("Failed to fetch associations");
    return res.json();
  }

  async function fetchProducts() {
    const res = await fetch('/api/admin/fetchProducts');
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  }

  const results = useQueries({
    queries: [
      {
        queryKey: ["associated-query"],
        queryFn: fetchAssociations,
      },
      {
        queryKey: ["product-query"],
        queryFn: fetchProducts,
      }
    ]
  });

  const associatedQuery = results[0];
  const productQuery = results[1];

  if (associatedQuery.isLoading || productQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (associatedQuery.error || productQuery.error) {
    return <p>Error loading data</p>;
  }

  const associations: ProductAssociation[] = associatedQuery.data ?? [];
  const products: Product[] = productQuery.data ?? [];

  // Calculate associations for each product
  const productAssociations = products.map((product) => {
    const filtered = associations.filter(
      (a) => a.product_id === product.product_id
    );

    return {
      product,
      related: filtered.filter((a) => a.association_type === "related").length,
      bundle: filtered.filter((a) => a.association_type === "bundle").length,
      alternative: filtered.filter((a) => a.association_type === "alternative").length,
      total: filtered.length,
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Product Associations</h1>
      {productAssociations.map(({ product, related, bundle, alternative, total }) => (
        <div key={product.product_id} className="border border-gray-300 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-3">
            {product.product_image && (
              <img 
                src={product.product_image} 
                alt={product.product_name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold">{product.product_name}</h2>
              <p className="text-sm text-gray-500">{product.sku_code}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-xl font-semibold">{total}</p>
            </div>
            <div>
              <p className="text-gray-600">Related</p>
              <p className="text-xl font-semibold text-blue-600">{related}</p>
            </div>
            <div>
              <p className="text-gray-600">Bundle</p>
              <p className="text-xl font-semibold text-green-600">{bundle}</p>
            </div>
            <div>
              <p className="text-gray-600">Alternative</p>
              <p className="text-xl font-semibold text-orange-600">{alternative}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
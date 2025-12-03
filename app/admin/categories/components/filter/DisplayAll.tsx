'use client';
import ProductTable from "@/app/components/Tables/productTable";
import { Categories, Product, Subcategories } from "@/type/productType";
import { useQuery } from "@tanstack/react-query";

export default function DisplayAll() {
  async function fetchProducts() {
    const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
    if (!res.ok) return console.error("Failed to fetch product datas");
    return res.json();
  }

  const { data: productData, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (productLoading) return <div>Products are loading...</div>;
  if (productError || !productData) return <div>Failed to fetch product datas...</div>;

  // Create lookup maps for quick access
  const categoryMap = new Map(
    productData.categories.map((cat: { category_id: string; category_name: string; }) => [cat.category_id, cat.category_name])
  );
  
  const subcategoryMap = new Map(
    productData.subcategories.map((sub: { subcategory_id: string; subcategory_name: string; }) => [sub.subcategory_id, sub.subcategory_name])
  );

  // Enhance products with category and subcategory names
  const enhancedProducts = productData.product.map((products: { category_id: Categories; subcategory_id: Subcategories }) => ({
    ...products,
    category_name: categoryMap.get(products.category_id) || 'Unknown',
    subcategory_name: subcategoryMap.get(products.subcategory_id) || 'Unknown'
  }));

  return (
    <div>
      <ProductTable 
      itemsPerPage={7}
      product={enhancedProducts} 
      columns={['sku-code', 'product_name', 'category_id', 'subcategory_id']} />
    </div>
  );
}
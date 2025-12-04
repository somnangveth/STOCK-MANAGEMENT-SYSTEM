"use client";
import ProductDetailCatalog from "@/app/components/catalog/productDetailCatalog";
import { cn } from "@/lib/utils";
import { Categories, Product, Subcategories, Vendors } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ProductDetailPage(){
  const param = useParams();
  const id = param.id;
  
  //Fetch Category and subcategory
  async function fetchCategoryAndSubcategory(){
    const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
    if(!res.ok){
      console.error('Failed to fetch category and subcategory');
      throw new Error("Failed to fetch");
    }
    return res.json();
  }
  
  //Fetch Products
  async function fetchProducts(){
    const res = await fetch('/api/admin/fetchProducts');
    if(!res.ok){
      console.error("Failed to fetch products");
      throw new Error("Failed to fetch");
    }
    return res.json();
  }
  
  //Fetch Vendors
  async function fetchVendors(){
    const res = await fetch('/api/admin/fetchVendors');
    if(!res.ok){
      console.error("Failed to fetch vendor data");
      throw new Error('Failed to fetch');
    }
    return res.json();
  }
  
  const result = useQueries({
    queries: [
      {
        queryKey: ["category-subcategory-query"],
        queryFn: fetchCategoryAndSubcategory,
      },
      {
        queryKey: ["productsQuery"],
        queryFn: fetchProducts,
      },
      {
        queryKey: ["vendorQuery"],
        queryFn: fetchVendors,
      }
    ]
  });
  
  const categorySubcategoryData = result[0].data;
  const productData = result[1].data;
  const vendorData = result[2].data;
  const isLoading = result[0].isLoading || result[1].isLoading || result[2].isLoading;
  const hasError = result[0].error || result[1].error || result[2].error;
  
  //Extract Products with the specific ID params 
  const product = useMemo(() => {
    if(!productData || !id) return null;
    return productData.find((p: Product) => p.product_id === id);
  }, [productData, id]);
  
  //Extracts Category name 
  const categories = useMemo(() => {
    if(!categorySubcategoryData || !product) return null;
    const categoriesArray = categorySubcategoryData.categories || categorySubcategoryData;
    if(!Array.isArray(categoriesArray)) return null;
    return categoriesArray.find((cat: any) => 
      cat.category_id === product.category_id
    );
  }, [categorySubcategoryData, product]);
  
  //Extract Subcategory name
  const subcategories = useMemo(() => {
    if(!categorySubcategoryData || !product) return null;
    const subcategoriesArray = categorySubcategoryData.subcategories || categorySubcategoryData;
    if(!Array.isArray(subcategoriesArray)) return null;
    return subcategoriesArray.find((sub: any) => 
      sub.subcategory_id === product.subcategory_id
    );
  }, [product, categorySubcategoryData]);
  
  //Extract Vendors Name (FIXED: used product instead of productData)
  const vendors = useMemo(() => {
    if(!vendorData || !product) return null;
    return vendorData.find((vendor: Vendors) => vendor.vendor_id === product.vendor_id);
  }, [vendorData, product]);
  

  if(isLoading) {
    return(
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p className="flex items-center gap-2">
          Loading <AiOutlineLoading3Quarters className={cn("animate-spin")}/>
        </p>
      </div>
    )
  }
  
  if(hasError) {
    return(
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p>Failed to Load</p>
      </div>
    )
  }
  
  // ADD NULL CHECKS before rendering
  if(!product || !vendors || !categories || !subcategories) {
    return(
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p>Product not found</p>
      </div>
    )
  }
  
  return (
    <div>
      <ProductDetailCatalog 
        product={product} 
        vendor={vendors} 
        category={categories} 
        subcategory={subcategories}
      />
    </div>
  )
}
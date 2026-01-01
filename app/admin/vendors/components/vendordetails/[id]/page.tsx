"use client";
import VendorDetailCatalog from "@/app/components/catalog/vendorDetailCatalog";
import { cn } from "@/lib/utils";
import { Product, Vendors } from "@/type/productType";
import { Ledger } from "@/type/ledger"
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function VendorDetailPage(){
  const param = useParams();
  const id = param.id;
  
  //fetch Vendors (FIXED: added parentheses to res.json())
  //请求商家数据
  async function fetchVendors(){
    const res = await fetch('/api/admin/fetchVendors');
    if(!res.ok){
      console.error("Failed to fetch vendor data");
      throw new Error("Failed to fetch");
    }
    return res.json();
  }
  
  //fetch Products (FIXED: endpoint from fetchProduct to fetchProducts)
  //请求产品数据
  async function fetchProducts(){
    const res = await fetch('/api/admin/fetchProducts');
    if(!res.ok){
      console.error("Failed to fetch Product data");
      throw new Error("Failed to fetch");
    }
    return res.json();
  }

  async function fetchLedger(){
    const res = await fetch('/api/admin/fetchLedger');
    if(!res.ok){
      console.error("Failed to fetch Product data");
      throw new Error("Failed to fetch");
    }
    return res.json();
  }
  
  //请求两个接口，并行处理，不互相阻碍
  //useQueries 接收一个查询对象数组
  //React Query 会分别处理每个查询(Loading error cache等)
  const result = useQueries({
    queries: [
      {
        queryKey: ["vendorQuery"],
        queryFn: fetchVendors,
      },
      {
        queryKey: ["productsQuery"],
        queryFn: fetchProducts,
      }
    ]
  });
  
  //统一处理结果
  //只要有一个在加载 → 显示 loading, 只要有一个报错 → 显示 error
  const vendorData = result[0].data;//获取商家数据
  const productData = result[1].data;//获取产品数据(结果)
  const isLoading = result[0].isLoading || result[1].isLoading;
  const hasError = result[0].error || result[1].error;
  
  //Extract Vendor Info to a specific ID
  //根据 URL 的 id 找到当前商家
  const vendors = useMemo(() => {
    if(!vendorData || !id) return null;
    const vendorArray = vendorData;
    if(!Array.isArray(vendorArray)) return null;
    // Compare both as strings to handle type mismatches
    return vendorArray.find((vendor: Vendors) => 
      String(vendor.vendor_id) === String(id) //从 所有商家列表 中，找到：vendor.vendor_id === URL里的 id,是string是因为防止后端是num,前端是string类型不匹配的问题
    );
  }, [vendorData, id]);
  

  //找到这个商家的商品
  const products = useMemo(() => {
    if(!productData || !vendors) return null;
    const productArray = productData;
    if(!Array.isArray(productArray)) return null;
    return productArray.filter((product: Product) => 
      product.vendor_id === vendors.vendor_id); //原代码使用find ，换成filter是因为find只会返回第一个匹配项，而filter会返回所有匹配的商品
    //return productArray.find((product: Product) => product.vendor_id === vendors.vendor_id);
  }, [productData, vendors]);
  
  // Added loading state
  if(isLoading) {
    return(
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p className="flex items-center gap-2">
          Loading <AiOutlineLoading3Quarters className={cn("animate-spin")}/>
        </p>
      </div>
    )
  }
  
  // Added error state
  if(hasError) {
    return(
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p>Failed to Load</p>
      </div>
    )
  }
  
  // Added null checks before rendering
  if(!vendors) {
    return(
      <div className="text-gray-500 flex items-center justify-center h-screen">
        <p>Vendor not found</p>
      </div>
    )
  }
  
  // Note: products can be null if vendor has no products
  return(
    <div>
      <VendorDetailCatalog product={products} vendor={vendors}/>
    </div>
  )
}
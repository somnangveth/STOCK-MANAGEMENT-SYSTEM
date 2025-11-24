"use server";
import { createSupabaseAdmin } from "@/lib/supbase/action";

// Create new Product
export async function createProduct(data: {
    product_id: string,
    product_name: string,
    description: string,
    product_image: string,
}){
    const supabase = await createSupabaseAdmin();

    const {data: productData, error: productError } = await supabase
    .from("products")
    .insert(data)
    .eq("product_id", data.product_id)
    .single();

    if(productError){
        throw new Error("Failed to insert products", productError);
    }

    return JSON.stringify(productData);
}

//Fetch All Products
export async function fetchProducts() {
  const supabase = await createSupabaseAdmin();

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("*");

  if (productError) {
    console.error("Supabase query error:", productError); 
    console.error("Hint: check table name, column names, and RLS policies.");
    throw new Error(`Failed to fetch product data: ${productError.message}`);
  }

  return productData;
}
"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";

export async function addPrice(data: {
  product_id: string;
  base_price: number;
  tax: number;
  final_price: number;
  profit_price: number;
  shipping: number;
  discount: number;
}) {
  const supabase = await createSupabaseAdmin();

  try {
    console.log("📌 Price Insert Payload:", data);

    const { data: priceData, error } = await supabase
      .from("prices")
      .insert({
        product_id: data.product_id,
        base_price: data.base_price,
        tax: data.tax,
        final_price: data.final_price,
        profit_price: data.profit_price,
        shipping: data.shipping,
        discount: data.discount,
      })
      .select("*");

    if (error) {
      console.error("❌ Supabase Insert Error:", error);

      // Important: return the REAL supabase message to frontend
      throw new Error(error.message);
    }

    console.log("✅ Price Inserted:", priceData);

    return { success: true, price: priceData };
  } catch (err: any) {
    console.error("🔥 Insert Price Failed:", err.message);
    throw new Error(err.message || "Failed to insert price");
  }
}

//Update Product Price
export async function updatePrice(
  product_id: string,
  data: Partial<{
    base_price: number;
    tax: number;
    final_price: number;
    profit_price: number;
    shipping: number;
    discount: number;
  }>
){
  const supabase = await createSupabaseAdmin();

  try{
    console.log("Updating Price...");

    const {data: priceData, error: priceError} = await supabase
    .from("prices")
    .update({
      base_price: data.base_price,
      tax: data.tax,
      final_price: data.final_price,
      profit_price: data.profit_price,
      shipping: data.shipping,
      discount: data.discount,
    })
    .eq("product_id", product_id);

    if(priceError){
      console.error("Failed to fetch price data", priceError);
      throw new Error("Error fetching");
    }

    return priceData;
     
  }catch(error){
    console.error("Failed to fetch: ", error);
  }
}


//Delete price
export async function deletePrice(price_id: string){
  const supabase = await createSupabaseAdmin();
  

  try{

    const {data: priceData, error: priceError} = await supabase
    .from("prices")
    .delete()
    .eq("price_id", price_id)
    .single();


    if(priceError){
      console.error("Failed to delete price", priceError);
      throw new Error("Error Deleting...");
    }

    return priceData;
  }catch(error){
    console.error("Failed to delete", error);
  }
}

//Fetch Price
export async function fetchPrice(){
  const supabase = await createSupabaseAdmin();

  const {data: priceData, error: priceError} = await supabase
  .from("prices")
  .select("*");

  if(priceError){
    console.error("Failed to fetch price data");
    throw new Error("Error fetching...");
  }

  return priceData;
}
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

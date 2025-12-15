"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";
import { revalidatePath } from "next/cache";

/* =========================
   CREATE PRICE
========================= */

export async function createPrice(data: {
  product_id: string;
  base_price: number;
  tax: number;
  profit_price: number;
  shipping: number;
  discount_price: number;
  total_price: number; // B2C
  b2b_price: number; // ✅ B2B
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
        profit_price: data.profit_price,
        shipping: data.shipping,
        discount_price: data.discount_price ?? 0,
        total_price: data.total_price, // B2C
        b2b_price: data.b2b_price, // ✅ ADD HERE
      })
      .select("*");

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Price Inserted:", priceData);

    revalidatePath("/admin/price");

    return { success: true, price: priceData };
  } catch (error) {
    console.error("🔥 Insert Price Failed:", error);
    throw error;
  }
}

/* =========================
   UPDATE PRICE
========================= */

export async function updatePrice(
  price_id: string,
  data: Partial<{
    base_price: number;
    tax: number;
    profit_price: number;
    shipping: number;
    discount_price: number;
    total_price: number; // B2C
    b2b_price: number; // ✅ B2B
  }>
) {
  const supabase = await createSupabaseAdmin();

  try {
    console.log("Updating Price...", price_id, data);

    const { data: priceData, error: priceError } = await supabase
      .from("prices")
      .update({
        base_price: data.base_price,
        tax: data.tax,
        profit_price: data.profit_price,
        shipping: data.shipping,
        discount_price: data.discount_price,
        total_price: data.total_price, // B2C
        b2b_price: data.b2b_price, // ✅ ADD HERE
      })
      .eq("price_id", price_id)
      .select("*")
      .single();

    if (priceError) {
      console.error("❌ Supabase Update Error:", priceError);
      throw new Error(priceError.message);
    }

    revalidatePath("/admin/price");
    return priceData;
  } catch (error) {
    console.error("Failed to Update: ", error);
    throw error;
  }
}

/* =========================
   DELETE PRICE
========================= */

export async function deletePrice(price_id: string) {
  const supabase = await createSupabaseAdmin();

  try {
    const { data: priceData, error: priceError } = await supabase
      .from("prices")
      .delete()
      .eq("price_id", price_id)
      .single();

    if (priceError) {
      console.error("Failed to delete price", priceError);
      throw new Error(priceError.message);
    }

    revalidatePath("/admin/price");
    return priceData;
  } catch (error) {
    console.error("Failed to delete", error);
    throw error;
  }
}

/* =========================
   FETCH PRICE
========================= */

export async function fetchPrice() {
  const supabase = await createSupabaseAdmin();

  try {
    const { data: priceData, error: priceError } = await supabase
      .from("prices")
      .select("*"); // ✅ returns b2b_price automatically

    if (priceError) {
      console.error("Failed to fetch price data", priceError);
      throw new Error(priceError.message);
    }

    return priceData;
  } catch (error) {
    console.error("Failed to fetch price data", error);
    throw error;
  }
}

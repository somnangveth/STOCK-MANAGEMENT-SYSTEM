"use server";

import { createClient } from "@/utils/supabase/server";

export async function createPrice(formData: FormData) {
  const supabase = createClient();

  const product_name = formData.get("product_name") as string;
  const base_price = Number(formData.get("base_price"));
  const tax = Number(formData.get("tax") || 0);

  const final_price = base_price + base_price * (tax / 100);

  const { error } = await supabase.from("prices").insert([
    {
      product_name,
      base_price,
      tax,
      final_price,
    },
  ]);

  if (error) {
    console.error("❌ Error inserting:", error);
    return { success: false, error };
  }

  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supbase/action";

function parsePriceForm(formData: FormData) {
  return {
    product_name: String(formData.get("product_name") || ""),

    base_price: Number(formData.get("base_price") || 0),
    profit_price: Number(formData.get("profit_price") || 0),
    tax: Number(formData.get("tax") || 0),
    shipping: Number(formData.get("shipping") || 0),
    discount: Number(formData.get("discount") || 0),

    final_price: Number(formData.get("final_price") || 0),
  };
}

export async function createPrice(formData: FormData) {
  const supabase = await createSupabaseAdmin();

  const data = parsePriceForm(formData);

  await supabase.from("prices").insert(data); 

  revalidatePath("/admin/price"); // ensures UI refreshes
}

export async function updatePrice(id: string, formData: FormData) {
  const supabase = await createSupabaseAdmin();

  const data = parsePriceForm(formData);

  await supabase.from("prices").update(data).eq("id", id); 

  revalidatePath("/admin/price");
}

export async function deletePrice(id: string) {
  const supabase = await createSupabaseAdmin();

  await supabase.from("prices").delete().eq("id", id); 

  revalidatePath("/admin/price");
}

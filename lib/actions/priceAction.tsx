"use server";

import { createSupabaseAdmin } from "../supbase/action";

// 获取价格
export async function fetchPrices() {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase.from("prices").select("*");
  if (error) throw new Error(error.message);
  return data;
}

// 获取产品
export async function fetchProducts() {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw new Error(error.message);
  return data;
}

// 新增价格
export async function addPrice(price: any) {
  const supabase = await createSupabaseAdmin();
  const { error } = await supabase.from("prices").insert([price]);
  if (error) throw new Error(error.message);
}

// 更新价格
export async function updatePrice(price: any) {
  const supabase = await createSupabaseAdmin();
  const { error } = await supabase
    .from("prices")
    .update(price)
    .eq("price_id", price.price_id);
  if (error) throw new Error(error.message);
}

// 删除价格
export async function deletePrice(price_id: string) {
  const supabase = await createSupabaseAdmin();
  const { error } = await supabase.from("prices").delete().eq("price_id", price_id);
  if (error) throw new Error(error.message);
}

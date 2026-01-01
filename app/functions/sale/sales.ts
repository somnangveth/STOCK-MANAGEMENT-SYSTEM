// app/functions/sale/sales.ts

"use server";

import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supbase/action";
import { Sale } from "@/app/admin/sales/type";

export async function addSaleServerSide({ p0 }: {
  p0: {
    customer_name: string;
    sale_date: any;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    sale_items: never[];
  };
}): Promise<Sale> {
  const supabase = await createSupabaseAdmin();

  const { data, error } = await supabase
    .from("sale")
    .insert([
      {
        sales_number: data.sales_number,
        sale_date: data.sale_date,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        payment_method: "Online",
        payment_status: "pending",
        process_status: "draft",
        subtotal: data.subtotal,
        tax_amount: data.tax_amount,
        discount_amount: data.discount_amount,
        total_amount: data.total_amount,
        note: data.note,
      },
    ])
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message || "Failed to create sale");

  return {
    sale_id: data.sale_id,
    sales_number: data.sales_number ?? "",
    sale_date: data.sale_date ?? "",
    customer_name: data.customer_name ?? "",
    customer_email: data.customer_email ?? "",
    customer_phone: data.customer_phone ?? "",
    payment_method: data.payment_method ?? "Online",
    payment_status: data.payment_status ?? "pending",
    process_status: data.process_status ?? "draft",
    subtotal: data.subtotal ?? 0,
    tax_amount: data.tax_amount ?? 0,
    discount_amount: data.discount_amount ?? 0,
    total_amount: data.total_amount ?? 0,
    items: [],
    note: data.note ?? "",
  };
}

// 添加销售项
export async function addSaleItemServerSide({
  sale_id,
  product_id,
  quantity,
  unit_price,
  total,
}: {
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
}) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("sale_items")
    .insert([{ sale_id, product_id, quantity, unit_price, total }])
    .select();

  if (error || !data) throw new Error(error?.message || "Failed to add sale item");

  return data;
}


//Fetch All Sales
export async function fetchSales(){
  const supabase = await createSupabaseAdmin();

  const {data: salesData, error: salesError} = await supabase
  .from("sale")
  .select("*");

  if(salesError){
    console.error("Error fetching sales:", salesError.message);
    throw new Error(salesError.message);
  }

  return salesData;
}

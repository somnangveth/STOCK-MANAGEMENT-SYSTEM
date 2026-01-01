//vendor/action/ledger.tsx

"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";
import { Ledger } from "@/type/ledger";

export type LedgerWithProduct = Ledger & {
  product_name: string;
  sku_code: string;
};

/**
 * 根据供应商 ID 获取 Ledger 数据
 * @param vendor_id 供应商 ID
 * @returns LedgerWithProduct[]
 */
export async function getLedgerByVendor(vendor_id: number): Promise<LedgerWithProduct[]> {
  try {
    const supabase = await createSupabaseAdmin();

    const { data, error } = await supabase
      .from("ledger")
      .select(`
        *,
        products:product_id (
          product_name,
          sku_code
        )
      `)
      .eq("vendor_id", vendor_id)
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error("Failed to fetch ledger:", error);
      return [];
    }

    const rows = (data as any[]) || [];
    const ledgerList: LedgerWithProduct[] = rows.map((item) => ({
      ...item,
      product_name: item.products?.product_name || "",
      sku_code: item.products?.sku_code || "",
    }));

    return ledgerList;

  } catch (err: any) {
    console.error("Unexpected error in getLedgerByVendor:", err);
    return [];
  }
}
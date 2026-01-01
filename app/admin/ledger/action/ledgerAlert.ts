"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";
import { LedgerAlert } from "@/type/Duedateledger";

export async function fetchLedgerAlert(): Promise<LedgerAlert> {
  const supabase = createSupabaseAdmin();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // 7 天后（快过期阈值）
  const soonDate = new Date();
  soonDate.setDate(today.getDate() + 7);
  const soonDateStr = soonDate.toISOString().split("T")[0];

  const { data, error } = await (await supabase)
    .from("ledger")
    .select("due_date")
    .eq("is_paid", false)
    .lte("due_date", soonDateStr); // 只拉可能相关的数据

  if (error) {
    console.error("fetchLedgerAlert error:", error);
    return {
      overSoonCount: 0,
      overdateCount: 0,
    };
  }

  let overSoonCount = 0;
  let overdateCount = 0;

  for (const item of data ?? []) {
    if (!item.due_date) continue;

    if (item.due_date < todayStr) {
      overdateCount++;
    } else {
      overSoonCount++;
    }
  }

  return {
    overSoonCount,
    overdateCount,
  };
}

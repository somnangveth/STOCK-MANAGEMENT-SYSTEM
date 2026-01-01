"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";

/**
 * Fetch ledger counts:
 * - dueSoonCount: 未来 3 天内到期未支付
 * - overdueCount: 已过期未支付
 */
export async function fetchLedgerAlert(): Promise<LedgerAlert> {
  const supabase = await createSupabaseAdmin();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // 计算未来 3 天
  const overSoonDate = new Date(today);
  overSoonDate.setDate(today.getDate() + 3);
  const overSoonStr = overSoonDate.toISOString().split("T")[0];

  // 已过期数量
  const { count: overdateCount = 0, error: overdateError } = await supabase
    .from("ledger")
    .select("*", { count: "exact", head: true })
    .lt("due_date", todayStr)
    .eq("is_paid", false);

  if (overdateError) {
    console.error("Error fetching overdate ledger count:", overdateError);
  }

  // 快到期数量（未来 3 天内到期，且未支付）
  const { count: overSoonCount = 0, error: overSoonError } = await supabase
    .from("ledger")
    .select("*", { count: "exact", head: true })
    .gte("due_date", todayStr)
    .lte("due_date", overSoonStr)
    .eq("is_paid", false);

  if (overSoonError) {
    console.error("Error fetching over soon ledger count:", overSoonError);
  }

  return {
    overdateCount,
    overSoonCount,
  };
}

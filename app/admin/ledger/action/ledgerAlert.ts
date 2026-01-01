"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";
import { LedgerAlert } from "@/type/Duedateledger";

export async function fetchLedgerAlert(): Promise<LedgerAlert> {
  const supabase = createSupabaseAdmin();

  const today = new Date().toISOString().split("T")[0];

  const { count, error } = await (await supabase)
    .from("ledger")
    .select("*", { count: "exact", head: true })
    .lte("due_date", today)
    .eq("is_paid", false);

  if (error) {
    console.error("fetchLedgerAlert error:", error);
    return { overSoonCount: 0 };
  }

  return {
    overSoonCount: count ?? 0,
  };
}

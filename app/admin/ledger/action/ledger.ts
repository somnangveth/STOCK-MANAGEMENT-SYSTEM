"use server";
import { createSupabaseAdmin } from "@/lib/supbase/action"
import { v4 as uuidv4 } from "uuid";
import { Ledger } from "@/type/membertype";
import { string } from "zod";

// ---- 获取所有 Vendor ----
export async function fetchVendors(): Promise<{ vendor_id: string; vendor_name: string }[]> {
  const supabase = await createSupabaseAdmin();
  const { data, error } = await supabase
    .from("vendors")
    .select("vendor_id, vendor_name");

  if (error) throw error;
  return data || [];
}

// ---- 创建 Ledger ----
export async function createLedger(data: Partial<{
  vendor_id: number;
  source_type: string;
  debit: number;
  credit: number;
  note: string;

}>) {
  const supabase = await createSupabaseAdmin();

  const balance = Number(data.credit) - Number(data.debit) - Number(data.credit)
  const { data: ledgerData, error: ledgerError } = await supabase
    .from("ledger")
    .insert(
      {
        vendor_id: data.vendor_id,
        source_type: data.source_type,
        debit: data.debit,
        credit: data.credit,
        balance: balance,
        note: data.note,
      },
    )
    .select();

    if(ledgerError) throw ledgerError;
  return ledgerData;
}


/**
 * Update Ledger
 */
export async function UpdateLedger(
  ledger_id: string,
  data: {
    vendor_id: number;
    source_type: string;
    source_id: string ;
    debit: number;
    credit: number;
    balance: number;
    note: string ;
  }
) {
  const supabase = await createSupabaseAdmin();

  try {
    const { data: ledgerData, error } = await supabase
      .from("ledger")
      .update({
        vendor_id: data.vendor_id,
        source_type: data.source_type,
        source_id: data.source_id,
        debit: data.debit,
        credit: data.credit,
        balance: data.balance,
        note: data.note,
      })
      .eq("ledger_id", ledger_id)
      .select()
      .single();

    if (error || !ledgerData) {
      console.error("❌ Update ledger failed:", error);
      return { error: "Failed to update ledger" };
    }

    return { data: ledgerData };
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return { error: "Unexpected error" };
  }
}

/**
 * Delete Ledger
 */
export async function  DeleteLedger(ledger_id: string) {
  const supabase = await createSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from("ledger")
      .delete()
      .eq("ledger_id", ledger_id)
      .select()
      .single();

    if (error) {
      console.error("❌ Delete ledger failed:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return { error: "Unexpected error" };
  }
}

/**
 * Fetch All Ledger
 */
export async function fetchLedger() {
  const supabase = await createSupabaseAdmin();

  try {
    const { data, error } = await supabase
      .from("ledger")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch ledger failed:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return { error: "Unexpected error" };
  }
}

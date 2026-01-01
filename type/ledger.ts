export interface Ledger {
  id: string;
  vendor_id: string;
  vendor_name: string;
  source_type: "purchase" | "refund";
  source_id: string;
  debit: number;
  credit: number;
  balance: number;
  note: string;
  created_at: string;
  created_by: string;
  over_date: string;
}

export interface EnhancedLedger extends Ledger {
  key: string; // React 列表 key
}

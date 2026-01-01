"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import LedgerTable, { ColumnConfig } from "@/app/components/Tables/ledgerTable";
import { EnhancedLedger } from "@/type/ledger";
import { fetchLedger } from "../action/ledger"; // Ledger 数据
import { fetchLedgerAlert } from "../action/ledgerAlert";
import { LedgerAlert } from "@/type/Duedateledger";


interface LedgerListProps {
  refreshKey?: number;
  onDataLoaded?: (
    data: EnhancedLedger[],
    onSearch: (results: EnhancedLedger[]) => void,
    searchKeys: (keyof EnhancedLedger)[]
  ) => void;
}

export default function LedgerList({ refreshKey = 0, onDataLoaded }: LedgerListProps) {
  const [displayLedgers, setDisplayLedgers] = useState<EnhancedLedger[]>([]);
  const [alert, setAlert] = useState<LedgerAlert>({ overSoonCount: 0, overdateCount: 0 });

  // 搜索回调
  const handleSearchResults = useCallback((results: EnhancedLedger[]) => {
    setDisplayLedgers(results);
  }, []);

  // 获取 Ledger 数据
  const { data, isLoading, error } = useQuery({
    queryKey: ["ledgers", refreshKey],
    queryFn: async () => {
      const res = await fetchLedger();
      const list = res.data || [];
      return list.map((item: any): EnhancedLedger => ({
        key: item.ledger_id,
        id: item.ledger_id,
        vendor_id: item.vendor_id,
        vendor_name: item.vendors?.vendor_name || "",
        source_type: item.source_type as "purchase" | "refund",
        source_id: item.source_id ?? null,
        debit: Number(item.debit ?? 0),
        credit: Number(item.credit ?? 0),
        balance: Number(item.balance ?? 0),
        note: item.note || "",
        created_at: item.created_at,
        over_date: item.over_date,
        created_by: ""
      }));
    },
  });

  // 获取红点 / 提示
  useEffect(() => {
    fetchLedgerAlert()
      .then(setAlert)
      .catch((err) => console.error("Failed to fetch ledger alert:", err));
  }, [refreshKey]);

  // 当数据变化时更新显示
  useEffect(() => {
    if (!data) return;

    setDisplayLedgers(data);

    if (onDataLoaded) {
      const searchKeys: (keyof EnhancedLedger)[] = ["vendor_name", "source_type", "created_by","id"];
      onDataLoaded(data, handleSearchResults, searchKeys);
    }
  }, [data, onDataLoaded, handleSearchResults]);

  if (isLoading) return <p className="p-8 text-gray-500">Loading ledger records...</p>;

  if (error)
    return (
      <div className="p-8 text-red-500">
        Failed to load ledger records
        <button
          onClick={() => window.location.reload()}
          className="ml-4 text-blue-600 hover:underline"
        >
          Retry
        </button>
      </div>
    );

  if (displayLedgers.length === 0) return <p className="p-8 text-gray-500">No ledger records found.</p>;

  // 表格列配置
  const columns: ColumnConfig<EnhancedLedger>[] = [
    { key: "vendor_name", label: "Vendor" },
    { key: "source_type", label: "Type" },
    { key: "debit", label: "Debit", render: (v) => 
    <span className="text-red-600">{Number(v).toFixed(2)}</span>
   },
    { key: "credit", label: "Credit", render: (v) => 
    <span className="text-green-600">{Number(v).toFixed(2)}</span> 
  },
    { key: "balance", label: "Balance", render: (v) => 
    <span className="font-medium">{Number(v).toFixed(2)}</span> 
  },
    { key: "over_date", label: "Date"},
    { key: "note", label: "Note" },
    { key: "created_at", label: "Date", render: (v) => 
      new Date(String(v)).toLocaleDateString() },
  ];

  return (
    <div>
      {/* 红点 / 提示 */}
      {(alert.overSoonCount > 0 || alert.overdateCount > 0) && (
        <div className="mb-4 flex gap-4 text-sm">
          {alert.overdateCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
              Overdue: {alert.overdateCount}
            </span>
          )}
          {alert.overSoonCount > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              Due Soon: {alert.overSoonCount}
            </span>
          )}
        </div>
      )}

      <LedgerTable ledger={displayLedgers} columns={columns} itemsPerPage={10} />
    </div>
  );
}

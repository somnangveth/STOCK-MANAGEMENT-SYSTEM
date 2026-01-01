'use client';

import { useState, useCallback } from "react";
import SearchBar from "@/app/components/SearchBar";
import LedgerList from "./components/ledgerlist";
import { EnhancedLedger } from "@/type/ledger";
import LedgerForm from "./components/ledgerform"; // 弹窗 + Add Ledger 按钮

export default function LedgerManagement() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [ledgers, setLedgers] = useState<EnhancedLedger[]>([]);
  const [searchConfig, setSearchConfig] = useState<{
    searchKeys: (keyof EnhancedLedger)[];
    onSearch: (results: EnhancedLedger[]) => void;
  } | null>(null);

  // LedgerList 数据加载回调 → 注册搜索功能
  const registerSearch = useCallback(
    (data: EnhancedLedger[], onSearch: (results: EnhancedLedger[]) => void, searchKeys: (keyof EnhancedLedger)[]) => {
      setLedgers(data);
      setSearchConfig({ searchKeys, onSearch });
    },
    []
  );

  // 新增 Ledger 成功 → 刷新列表
  const handleLedgerAdded = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* 标题 + 新增 Ledger 弹窗 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Ledger Management</h1>
        <LedgerForm onLedgerAdded={handleLedgerAdded} />
      </div>

      {/* 搜索栏 */}
      {searchConfig && (
        <div className="w-1/3 mt-4">
          <SearchBar
            data={ledgers}
            onSearch={searchConfig.onSearch}
            searchKeys={searchConfig.searchKeys}
            placeholder="Search vendor, type, note..."
          />
        </div>
      )}

      {/* Ledger 表格 */}
      <div className="mt-4">
        <LedgerList refreshKey={refreshKey} onDataLoaded={registerSearch} />
      </div>
    </div>
  );
}

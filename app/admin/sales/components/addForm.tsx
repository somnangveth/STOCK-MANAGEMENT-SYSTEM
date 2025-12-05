"use client";

import { useState } from "react";
import CreateSaleForm from "./addsales"; // 之前的表单组件
import AddSaleItemForm from "./AddSaleItemForm";
import { Sale, SaleItem } from "../type";

interface CreateSaleDealerProps {
  onAddSuccess?: (sale: Sale) => void; // ⚡ Sale 类型
}

export default function CreateSaleDealer({ onAddSuccess }: CreateSaleDealerProps) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [showForm, setShowForm] = useState(false); // 控制是否显示创建销售单表单

  const handleCreateSaleClick = () => {
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {!sale && !showForm && (
        <button
          onClick={handleCreateSaleClick}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add New Sale
        </button>
      )}

      {showForm && !sale && (
        <CreateSaleForm
          onAddSuccess={(newSale: Sale) => {
            // ⚡ 初始化 items 数组
            const fullSale: Sale = { ...newSale, items: newSale.items ?? [] };
            setSale(fullSale);
            setShowForm(false); // 创建完成后隐藏创建表单
            onAddSuccess?.(fullSale); // 返回父组件
          }}
        />
      )}

      {sale && (
        <div className="space-y-4">
          <AddSaleItemForm
            sale={sale}
            onItemAdded={(updatedItems: SaleItem[]) => setSale({ ...sale, items: updatedItems })}
          />
        </div>
      )}
    </div>
  );
}

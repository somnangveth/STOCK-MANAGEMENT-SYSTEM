// app/admin/sales/components/createsaledealer.tsx

"use client";

import { useState } from "react";
import CreateSaleForm from "./addsales"; // 创建销售单表单
import AddSaleItemForm from "./AddSaleItemForm";
import { Sale, SaleItem } from "../type";

interface CreateSaleDealerProps {
  onAddSuccess?: (sale: Sale) => void;
}

export default function CreateSaleDealer({ onAddSuccess }: CreateSaleDealerProps) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateSaleClick = () => {
    setShowForm(true);
  };

  return (
    <div className="space-y-6">

      {/* 创建销售单表单 */}
      {showForm && !sale && (
        <CreateSaleForm
          onAddSuccess={(newSale: Sale) => {
            const fullSale: Sale = { ...newSale, items: newSale.items ?? [] };
            setSale(fullSale);
            setShowForm(false);
            onAddSuccess?.(fullSale);
          }}
        />
      )}

      {/* 添加销售项表单 */}
      {sale && (
        <div className="space-y-4">
          <AddSaleItemForm
            saleId={sale.sale_id} // ⚡ 修正这里，传 saleId 而不是整个对象
            onAdded={(newItems: SaleItem[]) =>
              setSale({ ...sale, items: newItems })
            }
          />
        </div>
      )}
    </div>
  );
}

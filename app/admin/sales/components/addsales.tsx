"use client";

import { useState } from "react";
import { Sale, SaleItem } from "../type";
import AddSaleItemForm from "./AddSaleItemForm";
import Receipt from "./receipt";
import { toast } from "sonner";
import { addSaleServerSide } from "@/app/functions/sale/sales"; // 我们会在下面写服务端调用

export default function CreateSaleDealer({ onAddSuccess }: { onAddSuccess?: (sale: Sale) => void }) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddNewSale = async () => {
    setIsCreating(true);
    try {
      // ⚡ 调用服务端创建销售单
      const newSale = await addSaleServerSide();
      setSale(newSale);
      toast.success("New sale created!");
      onAddSuccess?.(newSale);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create sale");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {!sale && (
        <button
          onClick={handleAddNewSale}
          disabled={isCreating}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isCreating ? "Creating..." : "Add New Sale"}
        </button>
      )}

      {sale && (
        <div className="space-y-4">
          <AddSaleItemForm
            sale={sale}
            onItemAdded={(updatedItems: SaleItem[]) =>
              setSale({ ...sale, items: updatedItems })
            }
          />
          <Receipt sale={sale} />
        </div>
      )}
    </div>
  );
}

// app/admin/sales/components/SalesTable.tsx

"use client";

import ProductTable from "@/app/components/Tables/productTable";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import EditModal from "./editmodel";
import AddForm from "./addForm";

export default function SalesTable() {
  async function fetchSalesData() {
    const res = await fetch("/api/admin/fetchSales");
    if (!res.ok) throw new Error("Failed to fetch Sales data");
    return res.json();
  }

  async function fetchCategoryAndSubcategory() {
    const res = await fetch("/api/admin/fetchCategoryAndSubcategory");
    if (!res.ok) throw new Error("Failed to fetch Category and Subcategory data");
    return res.json();
  }

  async function fetchProducts() {
    const res = await fetch("/api/admin/fetchProducts");
    if (!res.ok) throw new Error("Failed to fetch Products data");
    return res.json();
  }

  const result = useQueries({
    queries: [
      { queryKey: ["salesQuery"], queryFn: fetchSalesData },
      { queryKey: ["category-subcategory"], queryFn: fetchCategoryAndSubcategory },
      { queryKey: ["productsQuery"], queryFn: fetchProducts },
    ],
  });

  const salesData: any[] = Array.isArray(result[0].data) ? result[0].data : [];
  const isLoading = result[0].isLoading || result[1].isLoading || result[2].isLoading;

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleDelete = (item: any) => alert("Delete function delete API");
  const handleSave = (updated: any) => alert("Save function update API");

  const rows = salesData.map((item: any, index: number) => ({
    ...item,
    action: (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuIndex(openMenuIndex === index ? null : index);
          }}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {openMenuIndex === index && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setEditingItem(item);
                setOpenMenuIndex(null);
              }}
            >
              Edit
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              onClick={() => handleDelete(item)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div>



      {/* 表格显示 */}
      <ProductTable product={rows} columns={columns} itemsPerPage={7} />

      {editingItem && (
        <EditModal
          item={editingItem}
          fields={[
            "sales_number",
            "sale_date",
            "customer_name",
            "total_amount",
            "payment_status",
            "payment_method",
            "process_status",
            "note",
          ]}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// app/admin/sales/components/CustomerSalesTable.tsx

"use client";

import React, { useState } from "react";
import MoreMenu from "./MoreMenu";
import EditSidebar from "./editmodel";

export interface CustomerSale {
  sale_id: string;
  customer_name: string;
  customer_email: string;
  date: string;
  status: string;
  total_amount: number;
}

export default function CustomerSalesTable({ sales, setCustomerSales }: any) {
  const [editing, setEditing] = useState<any>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  const openEdit = (row: CustomerSale) => {
    setEditing(row);
    setOpenSidebar(true);
  };

  const deleteSale = async (row: CustomerSale) => {
    if (!confirm("Delete this order?")) return;

    await fetch("/api/sale/delete", {
      method: "POST",
      body: JSON.stringify({ sale_id: row.sale_id }),
    });

    setCustomerSales((prev: any) => prev.filter((c: any) => c.sale_id !== row.sale_id));
  };

  const saveEdit = async (values: any) => {
    await fetch("/api/sale/update", {
      method: "POST",
      body: JSON.stringify(values),
    });

    setCustomerSales((prev: any) =>
      prev.map((c: any) => (c.sale_id === values.sale_id ? values : c))
    );

    setOpenSidebar(false);
  };

  return (
    <>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left caret-gray-600">Name</th>
            <th className="p-2 border text-left caret-gray-600">Email</th>
            <th className="p-2 border text-left caret-gray-600">Date</th>
            <th className="p-2 border text-left caret-gray-600">Status</th>
            <th className="p-2 border text-left caret-gray-600">Total Amount</th>
            <th className="p-2 border text-left caret-gray-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sales.map((item: CustomerSale) => (
            <tr key={item.sale_id} className="hover:bg-gray-50">
              <td className="p-2 border text-left caret-gray-600">{item.customer_name}</td>
              <td className="p-2 border text-left caret-gray-600">{item.customer_email}</td>
              <td className="p-2 border text-left caret-gray-600">{item.date}</td>
              <td className="p-2 border text-left caret-gray-600">{item.status}</td>
              <td className="p-2 border text-left caret-gray-600">{item.total_amount}</td>
              <td className="p-2 border text-left caret-gray-600">
                <MoreMenu
                  onEdit={() => openEdit(item)}
                  onDelete={() => deleteSale(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditSidebar
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        data={editing}
        onSave={saveEdit}
      />
    </>
  );
}

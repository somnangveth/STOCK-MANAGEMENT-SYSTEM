"use client";

import React, { useState } from "react";
import MoreMenu from "./MoreMenu";
import EditSidebar from "./editmodel";

export interface Product {
  product_id: string;
  name: string;
  category: string;
  subCategory: string;
  date: string;
  wholesalePrice: string;
  retailPrice: string;
  status: string;
}

export default function PriceTable({ products, setProducts }: any) {
  const [editing, setEditing] = useState<any>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  const openEdit = (row: Product) => {
    setEditing(row);
    setOpenSidebar(true);
  };

  const deleteProduct = async (row: Product) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch("/api/product/delete", {
      method: "POST",
      body: JSON.stringify({ id: row.product_id }),
    });
    setProducts((prev: any) => prev.filter((p: any) => p.product_id !== row.product_id));
  };

  const saveEdit = async (values: any) => {
    await fetch("/api/product/update", {
      method: "POST",
      body: JSON.stringify(values),
    });

    setProducts((prev: any) =>
      prev.map((p: any) => (p.product_id === values.product_id ? values : p))
    );

    setOpenSidebar(false);
  };

  return (
    <>
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left caret-gray-600">Name</th>
            <th className="p-2 border text-left caret-gray-600">Category</th>
            <th className="p-2 border text-left caret-gray-600">Subcategory</th>
            <th className="p-2 border text-left caret-gray-600">Date</th>
            <th className="p-2 border text-left caret-gray-600">Wholesale Price</th>
            <th className="p-2 border text-left caret-gray-600">Retail Price</th>
            <th className="p-2 border text-left caret-gray-600">Status</th>
            <th className="p-2 border text-left caret-gray-600">More</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item: Product) => (
            <tr key={item.product_id} className="hover:bg-gray-50">
              <td className="p-2 border text-left caret-gray-600">{item.name}</td>
              <td className="p-2 border text-left caret-gray-600">{item.category}</td>
              <td className="p-2 border text-left caret-gray-600">{item.subCategory}</td>
              <td className="p-2 border text-left caret-gray-600">{item.date}</td>
              <td className="p-2 border text-left caret-gray-600">{item.wholesalePrice}</td>
              <td className="p-2 border text-left caret-gray-600">{item.retailPrice}</td>
              <td className="p-2 border text-left caret-gray-600">{item.status}</td>

              <td className="p-2 border text-left caret-gray-600">
                <MoreMenu
                  onEdit={() => openEdit(item)}
                  onDelete={() => deleteProduct(item)}
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

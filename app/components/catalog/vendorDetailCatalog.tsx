"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Product, Vendors } from "@/type/productType";
import { Ledger } from "@/type/membertype";
import { getLedgerByVendor } from "../../admin/vendors/actions/ledger";
import Updatevendor from "../../admin/vendors/components/editvendorform";
import DeleteVendor from "@/app/admin/vendors/components/Deletevendorform";

/* ===== Tabs Type ===== */
type TabKey = "Product" | "Ledger" | "DueDate";

export default function VendorDetailCatalog({
  vendor,
  product,
}: {
  vendor: Vendors;
  product: Product[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("Product");
  const [ledgerData, setLedgerData] = useState<Ledger[]>([]); // Ledger 数据

  // 页面加载时获取 Ledger
  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const data = await getLedgerByVendor(vendor.vendor_id);
        setLedgerData(data || []);
      } catch (error) {
        console.error("Failed to fetch ledger data", error);
      }
    };
    fetchLedger();
  }, [vendor.vendor_id]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between border-b pb-4">
        <Link href="/admin/vendors">
          <ArrowLeftIcon className="cursor-pointer" />
        </Link>
        <h1 className="text-xl font-semibold">
          {vendor.vendor_name} · Vendor Detail
        </h1>
      </div>

      {/* ===== Vendor Overview ===== */}
      <div className="flex gap-6 bg-amber-100 border rounded-xl p-5 shadow-sm">
        {/* Logo */}
        <div className="w-[150px] h-[150px] rounded-xl overflow-hidden border flex items-center justify-center bg-gray-100">
          {vendor.vendor_image ? (
            <img
              src={vendor.vendor_image}
              alt={vendor.vendor_name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-4xl font-bold text-gray-400">
              {vendor.vendor_name?.charAt(0) || "V"}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold">{vendor.vendor_name}</h2>
          <p className="text-gray-500 text-sm">ID: {vendor.vendor_id}</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p>
              <span className="text-gray-500">Contact:</span> {vendor.contact_person || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Email:</span> {vendor.vendor_email || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Phone 1:</span> {vendor.phone_number1 || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Phone 2:</span> {vendor.phone_number2 || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Address:</span> {vendor.address || "N/A"}
            </p>
            <p>
              <span className="text-gray-500">Vendor Type:</span> {vendor.vendortype || "N/A"}
            </p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="w-[180px] flex flex-col items-end justify-center gap-3 border-l pl-4">
          <Updatevendor vendor={vendor} />
          <DeleteVendor vendor={vendor} />
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="flex border-b">
          {[
            { key: "Product", label: "Product" },
            { key: "Ledger", label: "Ledger" },
            { key: "DueDate", label: "Due Date" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`px-6 py-3 text-sm font-medium transition
                ${
                  activeTab === tab.key
                    ? "border-b-2 border-violet-600 text-violet-600 bg-violet-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[200px]">
          {activeTab === "Product" && <ProductPanel products={product} />}
          {activeTab === "Ledger" && <LedgerPanel ledger={ledgerData} />}
          {activeTab === "DueDate" && <DueDatePanel />}
        </div>
      </div>
    </div>
  );
}

/* ===== Panels ===== */

const DueDatePanel = () => (
  <div className="text-gray-500 text-sm text-center">No Due Date Found.</div>
);

const ProductPanel = ({ products }: { products: Product[] }) => {
  if (!products || products.length === 0) {
    return <div className="text-gray-500 text-sm text-center">No Product Found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-4 py-3 border-b">Product</th>
            <th className="px-4 py-3 border-b">SKU</th>
            <th className="px-4 py-3 border-b">Price</th>
            <th className="px-4 py-3 border-b">Quantity</th>
            <th className="px-4 py-3 border-b">Status</th>
            <th className="px-4 py-3 border-b">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.product_id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 border-b font-medium">{item.product_name}</td>
              <td className="px-4 py-3 border-b text-sm">{item.sku_code}</td>
              <td className="px-4 py-3 border-b text-sm font-semibold">${item.total_price}</td>
              <td className="px-4 py-3 border-b text-sm">{item.quantity_remaining ?? "N/A"}</td>
              <td className="px-4 py-3 border-b text-sm">{item.quantity_remaining ?? "N/A"}</td>
              <td className="px-4 py-3 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (item.quantity_remaining ?? 0) > 50
                      ? "bg-green-100 text-green-700"
                      : (item.quantity_remaining ?? 0) > 10
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {(item.quantity_remaining ?? 0) > 50
                    ? "In Stock"
                    : (item.quantity_remaining ?? 0) > 10
                    ? "Low Stock"
                    : "Out of Stock"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LedgerPanel = ({ ledger }: { ledger: Ledger[] }) => {
  if (!ledger || ledger.length === 0) {
    return <div className="text-gray-500 text-sm text-center">No Ledger Found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-4 py-3 border-b">ID</th>
            <th className="px-4 py-3 border-b">Name</th>
            <th className="px-4 py-3 border-b">Source Type</th>
            <th className="px-4 py-3 border-b">Balance</th>
            <th className="px-4 py-3 border-b">Credit</th>
            <th className="px-4 py-3 border-b">Debit</th>
            <th className="px-4 py-3 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 border-b">{item.id}</td>
              <td className="px-4 py-3 border-b">{item.vendor_name}</td>
              <td className="px-4 py-3 border-b">{item.source_type}</td>
              <td className="px-4 py-3 border-b">{item.balance}</td>
              <td className="px-4 py-3 border-b">${item.credit}</td>
              <td className="px-4 py-3 border-b">${item.debit}</td>
              <td className="px-4 py-3 border-b">{item.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

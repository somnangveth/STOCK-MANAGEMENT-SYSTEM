//price-tabs.tsx


"use client";
import React from "react";

interface SaleTabsProps {
  selectedTab: "Product" | "Customer";
  onTabChange: (tab: "Product" | "Customer") => void;
}

export default function SaleTabs({ selectedTab, onTabChange }: SaleTabsProps) {
  return (
    <div className="flex gap-10 text-lg border-b pb-2">
      <button
        className={`pb-2 ${
          selectedTab === "Product"
            ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`
        }
        onClick={() => onTabChange("Product")}
      >
        Product
      </button>

      <button
        className={`pb-2 ${
          selectedTab === "Customer"
            ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
        onClick={() => onTabChange("Customer")}
      >
        Customer
      </button>
    </div>
  );
}

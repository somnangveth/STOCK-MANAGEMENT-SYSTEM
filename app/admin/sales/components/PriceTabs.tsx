"use client";
import React from "react";

interface PriceTabsProps {
  selectedTab: "Product" | "Customer";
  onTabChange: (tab: "Product" | "Customer") => void;
}

export default function PriceTabs({ selectedTab, onTabChange }: PriceTabsProps) {
  return (
    <div className="flex gap-10 text-lg border-b pb-2">
      <button
        className={`pb-2 ${
          selectedTab === "Product"
            ? "border-b-2 border-blue-400 text-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }`}
        onClick={() => onTabChange("Product")}
      >
        Product
      </button>

      <button
        className={`pb-2 ${
          selectedTab === "Customer"
            ? "border-b-2 border-blue-400 text-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }`}
        onClick={() => onTabChange("Customer")}
      >
        Customer
      </button>
    </div>
  );
}

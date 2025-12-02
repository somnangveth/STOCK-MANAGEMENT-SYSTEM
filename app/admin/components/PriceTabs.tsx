import React, { FC } from "react";

interface PriceTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const PriceTabs: FC<PriceTabsProps> = ({ selectedTab, onTabChange }) => {
  return (
    <div className="flex gap-10 text-lg border-b pb-2">
     
      <button
        className={`pb-2 ${selectedTab === "Product" ? "border-b-2 border-blue-400 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
        onClick={() => onTabChange("Product")}
      >
        Product
      </button>
      <button
        className={`pb-2 ${selectedTab === "Customer" ? "border-b-2 border-blue-400 text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
        onClick={() => onTabChange("Customer")}
      >
        Customer
      </button>
    </div>
  );
};

export default PriceTabs;

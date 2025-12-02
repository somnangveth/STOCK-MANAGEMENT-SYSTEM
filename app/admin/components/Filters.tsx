"use client";

import { ChevronDown } from "lucide-react";

interface FiltersProps {
  category: string;
  setCategory: (value: string) => void;
  subCategory: string;
  setSubCategory: (value: string) => void;
  product: string;
  setProduct: (value: string) => void;
  state: string;
  setState: (value: string) => void;
  fromDate: string;
  setFromDate: (value: string) => void;
  toDate: string;
  setToDate: (value: string) => void;
  categoryType: "product" | "customer";
}

export default function Filters({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  product,
  setProduct,
  state,
  setState,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  categoryType,
}: FiltersProps) {
  const categoryOptions =
    categoryType === "customer"
      ? ["Select", "批发客户", "零售客户"]
      : ["Select", "膨化食品", "饮料", "巧克力", "坚果"];

  const subCategoryOptions = ["Select", "辣味", "不辣", "原味"];
  const productOptions = ["Select", "柬埔寨辣虾片", "柬埔寨原味虾片", "巧克力牛奶", "草莓牛奶", "可乐"];
  const stateOptions = ["Select", "已发货", "未发货", "未付款"];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-8 gap-4 mb-6">
      {/* 类别 / 客户类型 */}
      <div className="flex flex-col text-sm">
        <label className="mb-1 font-medium">{categoryType === "customer" ? "客户类型:" : "类别:"}</label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* 子类别（仅商品模式） */}
      {categoryType === "product" && (
        <div className="flex flex-col text-sm">
          <label className="mb-1 font-medium">子类别:</label>
          <div className="relative">
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="border rounded px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subCategoryOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 产品（仅商品模式） */}
      {categoryType === "product" && (
        <div className="flex flex-col text-sm">
          <label className="mb-1 font-medium">产品:</label>
          <div className="relative">
            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="border rounded px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {productOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 状态（始终显示） */}
      <div className="flex flex-col text-sm">
        <label className="mb-1 font-medium">状态:</label>
        <div className="relative">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border rounded px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stateOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* From Date */}
      <div className="flex flex-col text-sm">
        <label className="mb-1 font-medium">从:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* To Date */}
      <div className="flex flex-col text-sm">
        <label className="mb-1 font-medium">到:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

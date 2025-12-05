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
  // 类别选项
  const categoryOptions =
    categoryType === "customer"
      ? ["Select", "General", "Wholesale", "Retail"]
      : [
          "Select",
          "Candy",
          "Pastry",
          "Nuts",
          "Puffed Snacks",
          "Meat Snacks",
          "Fruit Snacks",
          "Healthy Snacks",
          "Beverages",
        ];

  // 子类别映射
  const subCategoryMap: Record<string, string[]> = {
    Candy: ["Gummy", "Hard Candy", "Chocolate", "Chewing Gum", "Lollipops"],
    Pastry: ["Cookies", "Cakes", "Bread", "Muffins"],
    Nuts: ["Almonds", "Cashews", "Walnuts", "Pistachios", "Peanuts"],
    "Puffed Snacks": ["Potato Chips", "Corn Chips", "Shrimp Chips", "Rice Cakes", "Puffed Snack Sticks"],
    "Meat Snacks": ["Beef Jerky", "Pork Jerky", "Chicken Strips", "Dried Fish"],
    "Fruit Snacks": ["Dried Fruits (Raisins, Dates)", "Fruit Chips", "Jelly"],
    "Healthy Snacks": ["Oat Bars", "Energy Bars", "Yogurt", "Nut Mixes"],
    Beverages: ["Milk Tea", "Juice Drinks", "Cocoa", "Coffee Powder"],
  };

  // 产品映射
  const productMap: Record<string, string[]> = {
    Gummy: ["Fruit Gummy", "Rubber Gummy"],
    "Hard Candy": ["Mint Hard Candy", "Fruit Hard Candy"],
    Chocolate: ["Dark Chocolate", "Milk Chocolate"],
    "Chewing Gum": ["Mint Chewing Gum", "Fruit Chewing Gum"],
    Lollipops: ["Fruit Lollipops", "Cream Lollipops"],
    Cookies: ["Chocolate Cookies", "Cream Cookies"],
    Cakes: ["Cream Cakes", "Chocolate Cakes"],
    Bread: ["Baguette", "Toast"],
    Cashews: ["Original Cashews", "Curry Cashews"],
    "Potato Chips": ["Original Potato Chips", "Tomato Potato Chips"],
    "Corn Chips": ["Original Corn Chips", "Cheese Corn Chips"],
    "Shrimp Chips": ["Spicy Shrimp Chips", "Original Shrimp Chips"],
    "Rice Cakes": ["Original Rice Cakes", "Seaweed Rice Cakes"],
    "Puffed Snack Sticks": ["Cheese Sticks", "Spicy Sticks"],
    "Beef Jerky": ["Original Beef Jerky", "Spicy Beef Jerky"],
    "Dried Fruits (Raisins, Dates)": ["Apple Dried Fruits", "Mango Dried Fruits"],
    Jelly: ["Fruit Jelly", "Milk Jelly"],
    "Oat Bars": ["Chocolate Oat Bars", "Nut Oat Bars"],
    "Energy Bars": ["Chocolate Energy Bars", "Nut Energy Bars"],
    Yogurt: ["Original Yogurt", "Strawberry Yogurt"],
    "Nut Mixes": ["Mixed Nuts 1", "Mixed Nuts 2"],
    "Milk Tea": ["Original Milk Tea", "Bubble Milk Tea"],
    "Juice Drinks": ["Orange Juice", "Apple Juice"],
    Cocoa: ["Hot Cocoa", "Iced Cocoa"],
    "Coffee Powder": ["Instant Coffee", "Mocha Coffee"],
  };

  // 生成子类别选项
  const subCategoryOptions =
    category && category !== "Select" && subCategoryMap[category]
      ? ["Select", ...subCategoryMap[category]]
      : ["Select"];

  // 生成产品选项
  const productOptions =
    subCategory && subCategory !== "Select" && productMap[subCategory]
      ? ["Select", ...productMap[subCategory]]
      : ["Select"];

  const stateOptions = ["Select", "Shipped", "Not Shipped", "Unpaid"];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
      {/* 类别 */}
      <div className="flex flex-col text-sm">
        <label className="mb-1 font-medium">{categoryType === "customer" ? "客户类型:" : "类别:"}</label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("Select");
              setProduct("Select");
            }}
            className="border rounded px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* 子类别 */}
      {categoryType === "product" && (
        <div className="flex flex-col text-sm">
          <label className="mb-1 font-medium">Subcategory:</label>
          <div className="relative">
            <select
              value={subCategory}
              onChange={(e) => {
                setSubCategory(e.target.value);
                setProduct("Select");
              }}
              className="border rounded px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subCategoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 产品 */}
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
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 状态 */}
      <div className="flex flex-col text-sm">
        <label className="mb-1 font-medium">状态:</label>
        <div className="relative">
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border rounded px-3 py-2 w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {stateOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* From 日期 */}
      <div className="flex flex-col text-sm">
        <label className="mb-1 font-medium">从:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* To 日期 */}
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

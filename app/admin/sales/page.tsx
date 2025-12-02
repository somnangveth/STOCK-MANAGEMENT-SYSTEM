"use client";

import React, { useState, useEffect } from "react";
import Filters from "../components/Filters";
import PriceTabs from "../components/PriceTabs";
import PriceTable from "../components/PriceTable";
import CustomerSalesTable from "../components/CustomerSalesTable";

const allProducts = [
  { name: "Lay's", category: "膨化食品", subCategory: "Spacy", date: "2025-12-01", wholesalePrice: "$1.2", retailPrice: "$1.5", status: "已发货" },
  { name: "柬埔寨原味虾片", category: "膨化食品", subCategory: "不辣", date: "2025-12-02", wholesalePrice: "$1.0", retailPrice: "$1.3", status: "未付款" },
  { name: "Strawberry milk", category: "Drink", subCategory: "Milk", date: "2025-12-04", wholesalePrice: "$0.8", retailPrice: "$1.0", status: "未发货" },
  { name: "可乐", category: "饮料", subCategory: "原味", date: "2025-12-05", wholesalePrice: "$0.9", retailPrice: "$1.1", status: "已发货" },
];

const allCustomerSales = [
  { customer: "客户A", type: "批发客户", product: "柬埔寨辣虾片", quantity: 10, amount: 12, status: "已发货", date: "2025-12-01" },
  { customer: "客户B", type: "零售客户", product: "草莓牛奶", quantity: 5, amount: 4, status: "未付款", date: "2025-12-02" },
  { customer: "客户C", type: "批发客户", product: "柬埔寨原味虾片", quantity: 3, amount: 3.9, status: "已发货", date: "2025-12-03" },
  { customer: "客户D", type: "零售客户", product: "可乐", quantity: 2, amount: 2.2, status: "未发货", date: "2025-12-04" },
];

function Sales() {
  const [selectedTab, setSelectedTab] = useState<"All" | "Product" | "Customer">("Product");

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("Select");
  const [subCategoryFilter, setSubCategoryFilter] = useState("Select");
  const [productFilter, setProductFilter] = useState("Select");
  const [stateFilter, setStateFilter] = useState("Select");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Statistics
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTodayTotal(allProducts.filter(p => p.date === today).length);
    setWeekTotal(allProducts.length);
  }, []);

  // Tab 切换时重置 Filters（保留状态筛选）
  useEffect(() => {
    setCategoryFilter("Select");
    setSubCategoryFilter("Select");
    setProductFilter("Select");
    setFromDate("");
    setToDate("");
  }, [selectedTab]);

  // 筛选商品
  const filteredProducts = allProducts.filter((item) => {
    if (selectedTab === "Customer") return false;

    if (categoryFilter !== "Select" && item.category !== categoryFilter) return false;
    if (subCategoryFilter !== "Select" && item.subCategory !== subCategoryFilter) return false;
    if (productFilter !== "Select" && item.name !== productFilter) return false;
    if (stateFilter !== "Select" && item.status !== stateFilter) return false;
    if (fromDate && item.date < fromDate) return false;
    if (toDate && item.date > toDate) return false;

    return true;
  });

  // 筛选客户销售
  const filteredCustomerSales = allCustomerSales.filter((sale) => {
    if (selectedTab !== "Customer") return false;

    if (categoryFilter !== "Select" && sale.type !== categoryFilter) return false;
    if (stateFilter !== "Select" && sale.status !== stateFilter) return false;
    if (fromDate && sale.date < fromDate) return false;
    if (toDate && sale.date > toDate) return false;

    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-6 space-y-6">

        {/* 上半部分卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 今日销售趋势 */}
          <div className="bg-linear-to-r from-indigo-300 via-purple-200 to-pink-500 text-violet-600 p-6 rounded-3xl shadow-xl flex flex-col items-start justify-between border-3 border-black/70">
            <h2 className="text-sm font-semibold uppercase tracking-wide opacity-80">今日销售趋势</h2>
            <p className="text-5xl font-bold mt-4">${todayTotal}</p>
            <span className="mt-2 text-sm opacity-70">比昨日 +15%</span>
            <div className="mt-4 w-full h-1 bg-white/30 rounded-full"></div>
          </div>

          {/* 本周销售总额 */}
          <div className="bg-linear-to-r from-indigo-300 via-purple-200 to-pink-500 text-violet-600 p-6 rounded-3xl shadow-xl flex flex-col items-start justify-between border-3 border-black/70">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">本周销售总额</h2>
            <div className="flex-1 w-full flex items-center justify-center">
              <canvas id="salesChart"></canvas>
            </div>
            <div className="mt-4 text-xs text-gray-400 text-right">单位: USD</div>
          </div>
        </div>

        {/* Filters */}
        <Filters
          category={categoryFilter}
          setCategory={setCategoryFilter}
          subCategory={subCategoryFilter}
          setSubCategory={setSubCategoryFilter}
          product={productFilter}
          setProduct={setProductFilter}
          state={stateFilter}
          setState={setStateFilter}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          categoryType={selectedTab === "Customer" ? "customer" : "product"}
        />

        {/* Tabs */}
        <PriceTabs selectedTab={selectedTab} onTabChange={setSelectedTab} tabs={["Product", "Customer"]} />

        {/* 表格 */}
        <div className="space-y-4">
          {selectedTab === "Customer" && <CustomerSalesTable sales={filteredCustomerSales} />}
          {(selectedTab === "All" || selectedTab === "Product") && (
            <div className="overflow-y-auto max-h-96 border rounded">
              <PriceTable products={filteredProducts} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Sales;

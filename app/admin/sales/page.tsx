// app/admin/sales/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import Filters from "./components/Filters";
import PriceTabs from "./components/SaleTabs";
import SalesTable from "./components/SalesTable";
import CustomerSalesTable from "./components/CustomerSalesTable";
import AddSalesForm from "./components/addForm";
import Receipt from "./components/receipt";
import { addSaleWithValidation, submitSaleForm } from "@/app/functions/sale/sales";
import { Sale } from "./type";
import SaleTabs from "./components/SaleTabs";

export default function Sales() {
  const [selectedTab, setSelectedTab] = useState<"Product" | "Customer">("Product");
  const [products, setProducts] = useState<any[]>([]);
  const [customerSales, setCustomerSales] = useState<Sale[]>([]);
  const [currentSaleData, setCurrentSaleData] = useState<Sale | null>(null); // 当前销售单完整数据
  const receiptRef = useRef<HTMLDivElement>(null);

  // 加载销售数据
  const loadSales = async () => {
    const res = await fetch("/api/sales/get").then(r => r.json());
    const items = res.items || [];
    const sales = res.sales || [];

    setProducts(
      items.map((i: any) => ({
        id: i.sale_item_id,
        name: i.product?.product_name,
        category: i.product?.category,
        subCategory: i.product?.sub_category,
        status: i.sale?.process_status,
        date: i.sale?.sale_date,
        quantity: i.quantity,
        price: i.unit_price,
        total: i.total,
        sale_id: i.sale_id,
      }))
    );

    setCustomerSales(
      sales.map((s: any) => ({
        sale_id: s.sale_id,
        sales_number: s.sales_number ?? "",
        sale_date: s.sale_date,
        customer_name: s.customer_name,
        customer_email: s.customer_email ?? "",
        customer_phone: s.customer_phone,
        payment_method: s.payment_method ?? "",
        payment_status: s.payment_status ?? "",
        process_status: s.process_status ?? "",
        subtotal: s.subtotal ?? 0,
        tax_amount: s.tax_amount ?? 0,
        discount_amount: s.discount_amount ?? 0,
        total_amount: s.total_amount ?? 0,
        note: s.note ?? "",
        items: items
          .filter((i: any) => i.sale_id === s.sale_id)
          .map((i: any) => ({
            product_name: i.product?.product_name ?? "",
            quantity: i.quantity ?? 0,
            unit_price: i.unit_price ?? 0,
            total: i.total ?? 0,
          })),
      }))
    );
  };

  useEffect(() => {
    loadSales();
  }, []);


  // Filters
  const [categoryFilter, setCategoryFilter] = useState("Select");
  const [subCategoryFilter, setSubCategoryFilter] = useState("Select");
  const [productFilter, setProductFilter] = useState("Select");
  const [stateFilter, setStateFilter] = useState("Select");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredProducts = products.filter(item => {
    if (categoryFilter !== "Select" && item.category !== categoryFilter) return false;
    if (subCategoryFilter !== "Select" && item.subCategory !== subCategoryFilter) return false;
    if (productFilter !== "Select" && item.name !== productFilter) return false;
    if (stateFilter !== "Select" && item.status !== stateFilter) return false;
    if (fromDate && item.date < fromDate) return false;
    if (toDate && item.date > toDate) return false;
    return true;
  });

  const filteredCustomerSales = customerSales.filter(sale => {
    if (stateFilter !== "Select" && sale.process_status !== stateFilter) return false;
    if (fromDate && sale.sale_date < fromDate) return false;
    if (toDate && sale.sale_date > toDate) return false;
    return true;
  });

  return (
    <div className="flex-1 bg-[#fefaec] p-6">
      <main className="flex-1 p-6 space-y-6">
        {/* 卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-linear-to-r from-indigo-300 text-violet-600 p-6 rounded-3xl shadow-xl border-2 border-black/70">
            <h2 className="text-sm font-semibold">Today Sale</h2>
            <p className="text-5xl font-bold mt-4">{products.length}</p>
          </div>

          <div className="bg-linear-to-r from-indigo-300 text-violet-600 p-6 rounded-3xl shadow-xl border-2 border-black/70">
            <h2 className="text-sm font-semibold">This Week's Sales Total</h2>
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        {/* Filters */}
        <Filters
          category={categoryFilter} setCategory={setCategoryFilter}
          subCategory={subCategoryFilter} setSubCategory={setSubCategoryFilter}
          product={productFilter} setProduct={setProductFilter}
          state={stateFilter} setState={setStateFilter}
          fromDate={fromDate} setFromDate={setFromDate}
          toDate={toDate} setToDate={setToDate}
          categoryType={selectedTab === "Customer" ? "customer" : "product"}
        />

    
        <AddSalesForm onAddSuccess={(newSale) => {
            setCustomerSales(prev => [newSale, ...prev]); // 直接把新 sale 加入列表
            setCurrentSaleData(newSale);
          }} />


        {/* Tabs */}
        <SaleTabs selectedTab={selectedTab} onTabChange={setSelectedTab} tabs={["Product", "Customer"]} />

        {/* Tables */}
        {selectedTab === "Product" && <SalesTable />}
        {selectedTab === "Customer" && <CustomerSalesTable sales={filteredCustomerSales} setCustomerSales={setCustomerSales} />}

        {/* 收据单 */}
        {currentSaleData && (
          <div className="mt-6" ref={receiptRef}>
            <Receipt sale={currentSaleData} />
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Download Receipt
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

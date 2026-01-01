"use client";

import { useEffect, useState } from "react";
import { fetchPrices, fetchProducts, addPrice, updatePrice, deletePrice } from "@/lib/actions/priceAction";

interface Price {
  price_id?: string;
  product_id: string;
  base_price: number;
  tax: number;
  shipping: number;
  discount_price: number;
  profit_price: number;
  total_price: number;
}

interface Product {
  product_id: string;
  name: string;
}

export default function B2BPriceManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [editing, setEditing] = useState<Price | null>(null);
  const [newPrice, setNewPrice] = useState<Price | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取数据
  async function fetchData() {
    setLoading(true);
    try {
      const [priceData, productData] = await Promise.all([fetchPrices(), fetchProducts()]);
      setPrices(priceData || []);
      setProducts(productData || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 根据 product_id 获取产品名
  function getProductName(id: string) {
    const p = products.find(p => p.product_id === id);
    return p ? p.name : "Unknown Product";
  }

  // 自动计算 total_price
  function handleChange(price: Price, field: string, value: number) {
    const updated = { ...price, [field]: value };
    updated.total_price = updated.base_price + updated.tax + updated.shipping - updated.discount_price;
    return updated;
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      await updatePrice(editing);
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  }

  async function handleDelete(price_id: string) {
    if (!confirm("Are you sure to delete?")) return;
    try {
      await deletePrice(price_id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function handleAddNew() {
    if (!newPrice) return;
    try {
      await addPrice(newPrice);
      setNewPrice(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Product Price Manager</h2>

      {/* 新增按钮 */}
      {!newPrice && (
        <button
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() =>
            setNewPrice({
              product_id: "",
              base_price: 0,
              tax: 0,
              shipping: 0,
              discount_price: 0,
              profit_price: 0,
              total_price: 0,
            })
          }
        >
          + Add New Price
        </button>
      )}

      <div className="space-y-3">
        {/* 已有价格条目 */}
        {prices.map((p) => (
          <div
            key={p.price_id}
            className={`bg-white shadow rounded p-4 flex flex-wrap items-center gap-3 transition ${
              editing?.price_id === p.price_id ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex-1 min-w-[120px] font-medium">{getProductName(p.product_id)}</div>

            {["base_price","tax","shipping","discount_price","profit_price","total_price"].map((field) => (
              <div key={field} className="flex-1 min-w-20">
                {editing?.price_id === p.price_id && field !== "total_price" ? (
                  <input
                    type="number"
                    value={(editing as any)[field]}
                    onChange={(e) =>
                      setEditing(handleChange(editing, field, parseFloat(e.target.value)))
                    }
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <span className={field === "total_price" ? "font-semibold text-green-600" : ""}>
                    {(p as any)[field]}
                  </span>
                )}
              </div>
            ))}

            <div className="flex gap-2">
              {editing?.price_id === p.price_id ? (
                <>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    onClick={saveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => setEditing(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDelete(p.price_id!)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* 新增价格条目 */}
        {newPrice && (
          <div className="bg-white shadow rounded p-4 flex flex-wrap items-center gap-3 ring-2 ring-green-500">
            <div className="flex-1 min-w-[120px]">
              <select
                value={newPrice.product_id}
                onChange={(e) => setNewPrice({ ...newPrice, product_id: e.target.value })}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {["base_price","tax","shipping","discount_price","profit_price"].map((field) => (
              <div key={field} className="flex-1 min-w-20">
                <input
                  type="number"
                  value={(newPrice as any)[field]}
                  onChange={(e) => setNewPrice(handleChange(newPrice, field, parseFloat(e.target.value)))}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
            ))}

            <div className="flex-1 min-w-20 font-semibold text-green-600">
              {newPrice.total_price}
            </div>

            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                onClick={handleAddNew}
              >
                Add
              </button>
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                onClick={() => setNewPrice(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

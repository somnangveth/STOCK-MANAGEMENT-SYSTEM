"use client";

import { useEffect, useState } from "react";

export default function PriceList() {
  const [customerType, setCustomerType] = useState("B2C");
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    fetch(`/api/prices?customer_type=${customerType}`)
      .then((res) => res.json())
      .then(setPrices);
  }, [customerType]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Price Management</h2>

      {/* Customer Type Dropdown */}
      <select
        className="border p-2 rounded mt-3"
        value={customerType}
        onChange={(e) => setCustomerType(e.target.value)}
      >
        <option value="B2C">B2C Customer</option>
        <option value="B2B">B2B Customer</option>
      </select>

      {/* Table */}
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th>No.</th>
            <th>Name</th>
            <th>Base</th>
            <th>Profit</th>
            <th>Tax</th>
            <th>Discount</th>
            <th>Shipping</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {prices.map((p, idx) => (
            <tr key={p.product_id} className="border-b">
              <td>{idx + 1}</td>
              <td>{p.product_name}</td>
              <td>${p.base_price}</td>
              <td>${p.profit_price}</td>
              <td>{p.tax_percentage}%</td>
              <td>{p.discount_percentage}%</td>
              <td>${p.shipping_cost}</td>
              <td className="text-green-600 font-bold">${p.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

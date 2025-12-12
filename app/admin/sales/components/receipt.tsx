// app/admin/sales/components/receipt.tsx

"use client";

import { Sale } from "../type";

interface ReceiptProps {
  sale: Sale;
}

export default function Receipt({ sale }: ReceiptProps) {
  // ⚡ 给 items 提供默认空数组，防止 undefined
  const items = sale.items ?? [];

  return (
    <div className="p-6 border rounded shadow-md w-full max-w-lg mx-auto bg-white">
      <h2 className="text-xl font-bold mb-4">Receipt</h2>
      
      <div className="mb-2"><strong>Sales Number:</strong> {sale.sales_number}</div>
      <div className="mb-2"><strong>Date:</strong> {sale.sale_date}</div>
      <div className="mb-2"><strong>Customer:</strong> {sale.customer_name}</div>
      <div className="mb-2"><strong>Email:</strong> {sale.customer_email ?? "-"}</div>
      <div className="mb-2"><strong>Phone:</strong> {sale.customer_phone}</div>

      <div className="mt-4 mb-2 font-semibold">Items:</div>
      <table className="w-full border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">Product</th>
            <th className="border px-2 py-1 text-right">Qty</th>
            <th className="border px-2 py-1 text-right">Unit Price</th>
            <th className="border px-2 py-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td className="border px-2 py-1">{item.product_name}</td>
                <td className="border px-2 py-1 text-right">{item.quantity}</td>
                <td className="border px-2 py-1 text-right">${item.unit_price.toFixed(2)}</td>
                <td className="border px-2 py-1 text-right">${item.total.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-1 text-center" colSpan={4}>No items</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mb-1 flex justify-between">
        <span>Subtotal:</span>
        <span>${(sale.subtotal ?? 0).toFixed(2)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Tax:</span>
        <span>${(sale.tax_amount ?? 0).toFixed(2)}</span>
      </div>
      <div className="mb-1 flex justify-between">
        <span>Discount:</span>
        <span>${(sale.discount_amount ?? 0).toFixed(2)}</span>
      </div>
      <div className="mb-1 flex justify-between font-bold">
        <span>Total:</span>
        <span>${(sale.total_amount ?? 0).toFixed(2)}</span>
      </div>

      <div className="mt-4 mb-2 flex justify-between">
        <span>Payment Method:</span>
        <span>{sale.payment_method ?? "-"}</span>
      </div>
      <div className="mb-2 flex justify-between">
        <span>Payment Status:</span>
        <span>{sale.payment_status ?? "-"}</span>
      </div>
      <div className="mb-2 flex justify-between">
        <span>Process Status:</span>
        <span>{sale.process_status ?? "-"}</span>
      </div>
      {sale.note && (
        <div className="mt-2">
          <strong>Note:</strong> {sale.note}
        </div>
      )}
    </div>
  );
}

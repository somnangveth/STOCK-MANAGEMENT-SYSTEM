// app/admin/components/CustomerSalesTable.tsx

import React from "react";

interface CustomerSale {
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  status: string;
  type?: "批发客户" | "零售客户";
}

interface CustomerSalesTableProps {
  sales: CustomerSale[];
}

const CustomerSalesTable: React.FC<CustomerSalesTableProps> = ({ sales }) => {
  return (
    <table className="min-w-full border border-gray-200 rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">客户</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">类型</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">商品</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">数量</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">金额 ($)</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">状态</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          >
            <td className="px-4 py-2 text-sm">{sale.customer}</td>
            <td className="px-4 py-2 text-sm">{sale.type || "未知类型"}</td>
            <td className="px-4 py-2 text-sm">{sale.product}</td>
            <td className="px-4 py-2 text-sm">{sale.quantity}</td>
            <td className="px-4 py-2 text-sm">${sale.amount}</td>
            <td className="px-4 py-2 text-sm">
              <span 
                className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${sale.status === "已发货" ? "bg-green-100 text-green-800" : 
                    sale.status === "未发货" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}
              >
                {sale.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomerSalesTable;

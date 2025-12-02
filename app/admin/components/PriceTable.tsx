// PriceTable.tsx
import React from "react";

interface Product {
  name: string;
  category: string;
  subCategory: string;
  wholesalePrice: string;
  retailPrice: string;
  status: string;
}

interface Props {
  products: Product[];
}

const PriceTable: React.FC<Props> = ({ products }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">商品</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">类别</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">子类别</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">批发价</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">零售价</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">状态</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((p, idx) => (
          <tr key={idx}>
            <td className="px-4 py-2">{p.name}</td>
            <td className="px-4 py-2">{p.category}</td>
            <td className="px-4 py-2">{p.subCategory}</td>
            <td className="px-4 py-2">{p.wholesalePrice}</td>
            <td className="px-4 py-2">{p.retailPrice}</td>
            <td className="px-4 py-2">
              <span 
                className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${p.status === "已发货" ? "bg-green-100 text-green-800" : 
                    p.status === "未发货" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}
              >
                {p.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PriceTable;


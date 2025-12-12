"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PriceTable({ prices }: { prices: any[] }) {
  if (!prices || prices.length === 0) {
    return <p className="text-gray-500 p-4 text-center">No prices found.</p>;
  }

  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this price?")) return;

    const res = await fetch("/api/price/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete");
    }
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product name</th>
            <th className="p-3 text-left">SKU Code</th>
            <th className="p-3 text-left">Base Price</th>
            <th className="p-3 text-left">Final Price</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {prices.map((item) => (
            <tr key={item.price_id} className="border-t">
              <td className="p-3">{item.product?.product_name}</td>
              <td className="p-3">{item.product?.sku_code}</td>
              <td className="p-3">${item.base_price}</td>
              <td className="p-3">${item.final_price}</td>
              <td className="p-3 flex gap-3">
                <Link
                  href={`/admin/price/${item.price_id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/admin/price/${item.price_id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(item.price_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

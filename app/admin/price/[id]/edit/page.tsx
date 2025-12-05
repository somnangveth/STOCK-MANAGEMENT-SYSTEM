"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPrice({ params }) {
  const router = useRouter();
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/prices/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrice(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/prices/update`, {
      method: "POST",
      body: JSON.stringify({
        id: params.id,
        base_price: price.base_price,
        final_price: price.final_price,
      }),
    });

    if (res.ok) router.push("/admin/price");
    else alert("Failed to update");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Price</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-semibold">Base Price</label>
          <input
            type="number"
            value={price.base_price}
            onChange={(e) => setPrice({ ...price, base_price: e.target.value })}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label className="block font-semibold">Final Price</label>
          <input
            type="number"
            value={price.final_price}
            onChange={(e) =>
              setPrice({ ...price, final_price: e.target.value })
            }
            className="border p-2 w-full"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}

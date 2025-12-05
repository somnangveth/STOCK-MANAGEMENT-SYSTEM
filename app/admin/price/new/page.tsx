// app/admin/price/new/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AddPrice() {
  const router = useRouter();

  const [products, setProducts] = useState<
    { product_id: string; sku_code: string; product_name: string }[]
  >([]);
  const [form, setForm] = useState({
    product_id: "",
    base_price: 0,
    profit_price: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch products (anon key ok)
  useEffect(() => {
    let mounted = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setProducts(json.data || []);
      })
      .catch((e) => {
        console.error("Failed to load products", e);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "product_id" ? value : Number(value),
    }));
  }

  const finalPrice = useMemo(() => {
    const base = form.base_price + form.profit_price;
    const taxed = base + base * (form.tax / 100);
    const shippingCost = taxed + form.shipping;
    const discountAmount = shippingCost * (form.discount / 100);
    return Number((shippingCost - discountAmount).toFixed(2));
  }, [form]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
          const body = {
            product_id: form.product_id || null,
            base_price: form.base_price,
            profit_price: form.profit_price,
            tax: form.tax,
            shipping: form.shipping,
            discount: form.discount,
            final_price: finalPrice,
          };

          const res = await fetch("/api/prices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const json = await res.json();
          if (!res.ok) {
            throw new Error(json?.error || "Server returned an error");
          }

          router.push("/admin/price");
          router.refresh();
        } catch (err: any) {
          console.error("Create price failed:", err);
          setError(err?.message || "Unknown error");
        } finally {
          setLoading(false);
        }
      }}
      className="p-10 space-y-4 max-w-xl"
    >
      <h1 className="text-2xl font-semibold">Add Price</h1>

      {error && (
        <div className="text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      <div className="space-y-2">
        <Label>Product</Label>
        <select
          name="product_id"
          value={form.product_id}
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
          required
          className="w-full border rounded px-2 py-2"
        >
          <option value="">Select product...</option>
          {products.map((p) => (
            <option key={p.product_id} value={p.product_id}>
              {p.product_name} ({p.sku_code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Base Price</Label>
          <Input
            name="base_price"
            type="number"
            value={String(form.base_price)}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Profit</Label>
          <Input
            name="profit_price"
            type="number"
            value={String(form.profit_price)}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Tax (%)</Label>
          <Input
            name="tax"
            type="number"
            value={String(form.tax)}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Shipping</Label>
          <Input
            name="shipping"
            type="number"
            value={String(form.shipping)}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Discount (%)</Label>
          <Input
            name="discount"
            type="number"
            value={String(form.discount)}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label>Final Price</Label>
        <Input name="final_price" value={String(finalPrice)} readOnly />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Price"}
      </Button>
    </form>
  );
}

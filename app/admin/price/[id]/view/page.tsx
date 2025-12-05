import { supabaseServer } from "@/lib/supabaseServer";

export default async function ViewPrice({ params }) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("prices")
    .select(
      `
      price_id,
      base_price,
      final_price,
      product:product_id (
        product_name,
        sku_code
      )
    `
    )
    .eq("price_id", params.id)
    .single();

  if (!data) return <div>Price not found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Price</h1>

      <div className="bg-white p-5 border rounded shadow">
        <p>
          <strong>Product:</strong> {data.product.product_name}
        </p>
        <p>
          <strong>SKU:</strong> {data.product.sku_code}
        </p>
        <p>
          <strong>Base Price:</strong> ${data.base_price}
        </p>
        <p>
          <strong>Final Price:</strong> ${data.final_price}
        </p>
      </div>
    </div>
  );
}

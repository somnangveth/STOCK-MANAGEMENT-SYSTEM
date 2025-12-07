import Link from "next/link";
import PriceTable from "./PriceTable";
import { createSupabaseAdmin } from "@/lib/supbase/action";

async function getPrices() {
  const supabase = await createSupabaseAdmin();

  const { data: prices, error } = await supabase
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
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prices:", error);
    return [];
  }

  return prices || [];
}

export default async function PricePage() {
  const prices = await getPrices();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Price List</h1>

        <Link
          href="/admin/price/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Price
        </Link>
      </div>

      <PriceTable prices={prices} />
    </div>
  );
}

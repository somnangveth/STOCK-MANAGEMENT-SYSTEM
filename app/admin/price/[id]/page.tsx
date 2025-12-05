import { supabaseServer } from "@/lib/supabaseServer";

export default async function ViewPrice({ params }: any) {
  const supabase = supabaseServer();
  const { data: item } = await supabase
    .from("product_prices")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!item) return <p className="p-10">Not Found</p>;

  return (
    <div className="p-10 space-y-2">
      <h1 className="text-2xl font-bold">{item.product_name}</h1>
      <p>Base Price: ${item.base_price}</p>
      <p>Discount: {item.discount}%</p>
      <p className="font-bold text-green-600">
        Final Price: ${item.final_price}
      </p>
    </div>
  );
}

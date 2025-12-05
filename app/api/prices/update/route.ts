import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = supabaseServer();
  const body = await req.json();

  const { error } = await supabase
    .from("prices")
    .update({
      base_price: body.base_price,
      final_price: body.final_price,
    })
    .eq("price_id", body.id);

  return new Response(JSON.stringify({ success: !error }));
}

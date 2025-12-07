import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const { id } = await req.json();
  const supabase = supabaseServer();

  const { error } = await supabase.from("prices").delete().eq("price_id", id);

  return new Response(JSON.stringify({ success: !error }));
}

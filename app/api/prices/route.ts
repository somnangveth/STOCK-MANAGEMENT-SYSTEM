import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("final_prices").select("*");

  if (error) return Response.json({ error }, { status: 400 });

  return Response.json(data);
}

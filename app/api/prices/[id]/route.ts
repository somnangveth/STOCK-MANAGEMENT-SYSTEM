import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("prices")
    .select("*, product:products(*)")
    .eq("price_id", params.id)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(req, { params }) {
  const supabase = supabaseServer();

  const { error } = await supabase
    .from("prices")
    .delete()
    .eq("price_id", params.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}

import { supabase } from "@/lib/supabaseClient";

export async function GET(req, { params }) {
  const { data, error } = await supabase
    .from("product_prices")
    .select("*")
    .eq("product_id", params.productId)
    .single();

  return Response.json(data);
}

export async function PUT(req, { params }) {
  const values = await req.json();

  const { data, error } = await supabase
    .from("product_prices")
    .update(values)
    .eq("product_id", params.productId);

  return Response.json({ success: true });
}

export async function GET(req, { params }) {
  const { data } = await supabase
    .from("price_rules")
    .select("*")
    .eq("product_id", params.productId)
    .single();

  return Response.json(data);
}

export async function PUT(req, { params }) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("price_rules")
    .update(body)
    .eq("product_id", params.productId);

  return Response.json({ success: true });
}

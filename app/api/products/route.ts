import { createClient } from "@supabase/supabase-js";

export async function GET() {
  console.log("===== /api/products START =====");
  console.log("ENV CHECK:", {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? "KEY LOADED"
      : "KEY MISSING",
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("products")
    .select("product_id, sku_code, product_name")
    .order("product_name", { ascending: true });

  console.log("PRODUCT QUERY RESULT:", { data, error });
  console.log("===== /api/products END =====");

  return Response.json({ data, error });
}

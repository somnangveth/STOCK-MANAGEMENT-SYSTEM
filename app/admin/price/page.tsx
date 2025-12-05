// app/admin/price/page.tsx
import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import { deletePrice } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/app/admin/price/pagination"; // update path if your pagination file is elsewhere

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PricePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = 5;
  const offset = (page - 1) * limit;

  const supabase = supabaseServer();

  // join products to get product_name
  const { data, error } = await supabase
    .from("prices")
    .select(
      `
      id,
      product_id,
      base_price,
      profit_price,
      tax,
      shipping,
      discount,
      final_price,
      created_at,
      products:product_id ( product_name )
    `
    )
    .range(offset, offset + limit - 1);

  const { count } = await supabase
    .from("prices")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Fetch prices error:", error);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Price Management</h1>
        <Link href="/admin/price/new">
          <Button>Add Price</Button>
        </Link>
      </div>

      <Input
        name="search"
        placeholder="🔍 Search product..."
        className="max-w-md"
      />

      <table className="w-full text-sm border rounded-md">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 border">Product</th>
            <th className="p-3 border">Base</th>
            <th className="p-3 border">Profit</th>
            <th className="p-3 border">Tax</th>
            <th className="p-3 border">Shipping</th>
            <th className="p-3 border">Discount</th>
            <th className="p-3 border">Final</th>
            <th className="p-3 border">Created</th>
            <th className="p-3 border text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((p: any) => (
            <tr key={p.id} className="border">
              <td className="p-3">{p.products?.product_name ?? "—"}</td>
              <td className="p-3">${p.base_price ?? 0}</td>
              <td className="p-3">${p.profit_price ?? 0}</td>
              <td className="p-3">${p.tax ?? 0}</td>
              <td className="p-3">${p.shipping ?? 0}</td>
              <td className="p-3">
                <Badge>{p.discount ?? 0}%</Badge>
              </td>
              <td className="p-3 text-green-600 font-bold">
                ${p.final_price ?? 0}
              </td>
              <td className="p-3 text-sm text-gray-500">
                {p.created_at
                  ? new Date(p.created_at).toLocaleDateString()
                  : ""}
              </td>

              <td className="p-3 flex justify-center gap-3">
                <Link href={`/admin/price/${p.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>

                <Link href={`/admin/price/edit/${p.id}`}>
                  <Button size="sm">Edit</Button>
                </Link>

                <form action={deletePrice.bind(null, p.id)}>
                  <Button type="submit" size="sm" variant="destructive">
                    Delete
                  </Button>
                </form>
              </td>
            </tr>
          ))}

          {!data || data.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-6 text-center text-muted-foreground">
                No prices yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <Pagination total={count ?? 0} perPage={limit} />
    </div>
  );
}

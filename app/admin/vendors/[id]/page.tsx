// 文件路径：app/admin/vendors/[id]/page.tsx
// 从 purchase_items 表获取 unit_price (base price)

import { notFound } from "next/navigation";
import VendorDetailCatalog from "@/app/components/catalog/vendorDetailCatalog";
import { createSupabaseAdmin } from "@/lib/supbase/action";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VendorDetailPage({ params }: PageProps) {
  try {
    const { id } = await params;
    const vendorId = parseInt(id, 10);

    if (!id || isNaN(vendorId)) {
      notFound();
    }

    const supabase = await createSupabaseAdmin();

    // ===== 1. 获取供应商 =====
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("*")
      .eq("vendor_id", vendorId)
      .single();

    if (vendorError || !vendor) {
      notFound();
    }

    // ===== 2. 获取产品及其最新的 base price =====
    // 从 purchase_items 获取最新的 unit_price (base price)
    const { data: products = [], error: productsError } = await supabase
      .from("products")
      .select(`
        product_id,
        sku_code,
        product_name,
        product_image,
        max_stock_level,
        vendor_id,
        description
      `)
      .eq("vendor_id", vendorId)
      .order("product_name", { ascending: true });

    if (productsError) {
      console.error("⚠️ 产品查询错误:", productsError);
    }

    // ===== 3. 为每个产品获取最新的 base price =====
    // 从 purchase_items 中找到最新的 unit_price
    const productsWithPrice = await Promise.all(
      (products || []).map(async (p: any) => {
        const { data: latestPrice } = await supabase
          .from("purchase_items")
          .select("unit_price, created_at")
          .eq("product_id", p.product_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          ...p,
          basePrice: latestPrice ? Number(latestPrice.unit_price) || 0 : 0,
        };
      })
    );

    console.log("✅ 找到产品:", products.length, "个");
    console.log("✅ 产品价格已加载");

    // ===== 4. 获取账目 =====
    const { data: ledger = [] } = await supabase
      .from("ledger")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    // ===== 格式化产品数据 =====
    const formattedProducts = (productsWithPrice || []).map((p: any) => ({
      product_id: p.product_id,
      product_name: p.product_name || "Unknown",
      sku_code: p.sku_code || "N/A",
      vendor_id: p.vendor_id,
      unit_price: p.basePrice,  // ✅ Base price from purchase_items
      product_image: p.product_image || null,
      quantity_remaining: p.max_stock_level || 0,  // 使用库存上限作为参考
    }));

    // 格式化账目数据
    const formattedLedger = (ledger || []).map((l: any) => ({
      ledger_id: l.ledger_id,
      vendor_id: l.vendor_id,
      vendor_name: vendor.vendor_name,
      source_type: l.source_type || "N/A",
      debit: Number(l.debit) || 0,
      credit: Number(l.credit) || 0,
      balance: Number(l.balance) || 0,
      note: l.note || "",
      created_at: l.created_at,
      payment_duedate: l.payment_duedate,
      payment_status: l.payment_status || "unpaid",
      term_status: l.term_status || "normal",
    }));

    return (
      <VendorDetailCatalog
        vendor={vendor}
        product={formattedProducts}
        ledger={formattedLedger}
      />
    );
  } catch (error) {
    console.error("❌ 错误:", error);
    notFound();
  }
}
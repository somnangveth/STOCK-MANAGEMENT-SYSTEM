// app/api/admin/ledger/route.ts

import { fetchLedger} from "@/app/admin/ledger/action/ledger";
import { getLedgerStats, getOverdueLedgers, getUnpaidLedgers } from "@/app/admin/vendors/actions/ledger";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/ledger
 * 
 * 支持的查询参数:
 * - vendorId: 供应商 ID
 * - startDate: 开始日期 (YYYY-MM-DD)
 * - endDate: 结束日期 (YYYY-MM-DD)
 * - sourceType: 来源类型 (purchase|refund)
 * - paymentStatus: 支付状态 (paid|unpaid|pending)
 * - type: 查询类型 (all|unpaid|overdue|stats)
 * - limit: 每页数量 (默认100)
 * - offset: 偏移量 (默认0)
 * - sortBy: 排序字段 (created_at|balance|payment_duedate)
 * - sortOrder: 排序顺序 (asc|desc)
 * 
 * 示例:
 * GET /api/admin/ledger?type=unpaid
 * GET /api/admin/ledger?vendorId=1&startDate=2024-01-01&endDate=2024-12-31
 * GET /api/admin/ledger?type=stats&vendorId=1
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 获取查询参数
    const type = searchParams.get("type") || "all";
    const vendorId = searchParams.get("vendorId")
      ? parseInt(searchParams.get("vendorId")!, 10)
      : undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const sourceType = searchParams.get("sourceType") as
      | "purchase"
      | "refund"
      | undefined;
    const paymentStatus = searchParams.get("paymentStatus") as
      | "paid"
      | "unpaid"
      | "pending"
      | undefined;
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const sortBy = searchParams.get("sortBy") as
      | "created_at"
      | "balance"
      | "payment_duedate"
      | undefined;
    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | undefined;

    let result;

    // 根据查询类型返回不同的数据
    switch (type) {
      case "unpaid":
        // 获取未支付的账单
        result = await getUnpaidLedgers(vendorId);
        console.log("LEDGER API (unpaid) RETURN 👉", result);
        break;

      case "overdue":
        // 获取逾期账单
        result = await getOverdueLedgers(vendorId);
        console.log("LEDGER API (overdue) RETURN 👉", result);
        break;

      case "stats":
        // 获取统计信息
        result = await getLedgerStats(vendorId);
        console.log("LEDGER API (stats) RETURN 👉", result);
        break;

      default:
        // 获取所有账单（带过滤条件）
        result = await fetchLedger({
          vendorId,
          startDate,
          endDate,
          sourceType,
          paymentStatus,
          limit,
          offset,
          sortBy,
          sortOrder,
        });
        console.log("LEDGER API (all) RETURN 👉", result);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Failed to fetch ledger data", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch ledger data" },
      { status: 500 }
    );
  }
}
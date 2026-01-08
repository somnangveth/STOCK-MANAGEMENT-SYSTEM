// app/api/purchase/[id]/route.ts
import { fetchPurchaseOrder } from "@/app/admin/purchase/components/action/purchase-order";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const poId = params.id;

    if (!poId) {
      return NextResponse.json(
        { error: "Purchase ID is required" },
        { status: 400 }
      );
    }

    console.log("API: Fetching purchase order:", poId);

    const result = await fetchPurchaseOrder(poId);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: result.data, error: null },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
"use server";

import { fetchPrice } from "@/app/functions/price/price";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const price = await fetchPrice();
    return NextResponse.json(price);
  } catch (error) {
    console.error("Failed to fetch price data");
    throw error;
  }
}

"use server";

import { fetchSales } from "@/app/functions/sale/sales";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const sales = await fetchSales();
        return NextResponse.json(sales);
    } catch (error) {
        return NextResponse.error();
    }
}
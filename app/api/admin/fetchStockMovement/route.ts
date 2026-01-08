"use client";

import { fetchStockMovement } from "@/app/functions/admin/stock/stockalert/issueProduct";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const stockmovement = await fetchStockMovement();
        return NextResponse.json(stockmovement);
    }catch(error){
        return NextResponse.json(error);
    }
}
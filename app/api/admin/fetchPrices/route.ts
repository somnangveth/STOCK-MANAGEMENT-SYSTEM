"use server";
import { fetchPrice } from "@/app/functions/admin/price/price";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const price = await fetchPrice();
        return NextResponse.json(price);
    }catch(error){
        return NextResponse.json(error);
    }
}
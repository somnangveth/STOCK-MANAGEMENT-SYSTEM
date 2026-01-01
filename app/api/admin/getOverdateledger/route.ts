"use server";

import { getoverBatches } from "@/app/functions/admin";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const expiry = await getoverBatches();
        return NextResponse.json(expiry);
    }catch(error){
        console.error("Failed To fetch Over Date!", error);
        return NextResponse.json(error);
    }
}
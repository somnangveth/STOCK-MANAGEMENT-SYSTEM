import { fetchCategory } from "@/app/functions/stock/category/category";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const category =  await fetchCategory();
        return NextResponse.json(category);
    }catch(error: any){
        console.error(error.message);
        return NextResponse.json({error: error.message});
    }
}
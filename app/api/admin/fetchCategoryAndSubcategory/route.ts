import { fetchCategoriesAndSubcategories } from "@/app/functions/stock/product/product";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const {categories, subcategories} = await fetchCategoriesAndSubcategories();
        return NextResponse.json({categories, subcategories});
    }catch(error: any){
        console.error(error);
        return NextResponse.json({error: error.message});
    }
}
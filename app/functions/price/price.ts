"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";

export async function addPrice(
    data: {
        product_id: string;
        base_price: number;
        tax: number;
        final_price: number;
        profit_price: number;
        shipping: number;
        discount: number;
    }
){
    const supabase = await createSupabaseAdmin();

    try{

        const { data: priceData, error: priceError } = await supabase
        .from('prices')
        .insert({
            product_id: data.product_id,
            base_price: data.base_price,
            tax: data.tax,
            final_price: data.final_price,
            profit_price: data.profit_price,
            shipping: data.shipping,
            discount: data.discount,
        });

        if(priceError){
            console.error("Failed to insert price data");
            throw new Error("Failed to insert");
        }

        return {success: true, priceData};
    }catch(error){
        throw new Error("Failed to insert");
    }
}
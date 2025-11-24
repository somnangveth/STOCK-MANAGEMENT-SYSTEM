'use server';
import { createSupabaseAdmin } from "@/lib/supbase/action";

export async function fetchStock(){
    const supabase = await createSupabaseAdmin();

    const {data: stockData, error: stockError } = await supabase
    .from('test')
    .select('*');

    if(stockError){
        console.error('failed to fetch stock data', stockError);
        throw new Error('Failed to fetch', stockError);
    }

    return stockData;
}
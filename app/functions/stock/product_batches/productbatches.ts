"use server";
import { createSupabaseAdmin } from "@/lib/supbase/action";

//Add Batches
export async function addBatch(
    product_id: string,
    data: Partial<{
        batch_number: string;
        manufacture_date: Date,
        expiry_date: Date,
        recieved_date: Date,
        quantity: number,
        packages_recieved: number,
        units_per_package: number,
        cost_price: number,
        note: string,
    }>
){
    const supabase = await createSupabaseAdmin();

    try{
        const { data: batchData, error: batchError } = await supabase
        .from('product_batches')
        .insert({
            product_id: product_id,
            batch_number: data.batch_number,
            manufacture_date: data.manufacture_date,
            expiry_date: data.expiry_date,
            recieved_date: data.recieved_date,
            quantity: data.quantity,
            packages_recieved: data.packages_recieved,
            units_per_package: data.units_per_package,
            cost_price: data.cost_price,
            note: data.note,
        })
        .select();

        if(batchError) {
            console.error("Failed to insert product batch", batchError);
        }

        return batchData;

    }catch(error){
        console.error(JSON.stringify({error}));
    }
    
}

//Fetch All Batch 
export async function fetchBatch(){
    const supabase = await createSupabaseAdmin();

    const {data: batchData, error: batchError} = await supabase
    .from("product_batches")
    .select("*")
    .eq('status', 'active')
    .gt('quantity_remaining', 0)
    .order('expiry_date', {ascending: true});

    if(!batchData || batchError){
        console.error("Failed to fetch batch data");
        throw new Error("Failed to fetch");
    }

    return batchData;
}

//Fetch Expired Batches
export async function getExpiredBatches(){
    const today = new Date().toISOString().split('T')[0];

    const supabase = await createSupabaseAdmin();

    const {data, error} = await supabase
    .from('product_batches')
    .select("*")
    .lt('expiry_date', today)
    .eq('status', 'expired')
    .gt('quantity_remaining', 0)
    .order('expiry_date', {ascending: true});

    if(error){
        console.error('Error fetching expired batches', error);
        throw error;
    }

    return data;
}
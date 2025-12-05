"use server";
import { createSupabaseAdmin } from "@/lib/supbase/action";


//Create new Suppliers
export async function createVendors(data: Partial<{
    vendor_id: string,
    vendor_name: string,
    phone_number1: string,
    phone_number2: string,
    vendor_email: string,
    vendor_location: string;
    vendor_image: string,
}>){
    const supabase = await createSupabaseAdmin();

    const { data: vendorData, error: vendorError } = await supabase
    .from("vendors")
    .insert(data)
    .eq("vendor_id", data.vendor_id)
    .single();

    if(vendorError){
        throw new Error("Failed to insert vendor Info", vendorError);
    }

    return JSON.stringify(vendorData);
}
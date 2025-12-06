"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";

export async function fetchPermissionTable(){
    const supabase = await createSupabaseAdmin();

    try{
        const {data: permissionData, error: permissionError} = await supabase
        .from("permission_table")
        .select("*");

        if(permissionError){
            console.error("Failed to load permission table data");
            throw new Error("Failed to fetch");
        }

        return permissionData;
    }catch(error){

    }
}
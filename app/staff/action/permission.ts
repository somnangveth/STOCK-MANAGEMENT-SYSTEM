"use client";

import { createSupabaseAdmin } from "@/lib/supbase/action";

export async function fetchStaffPermission(){
    const supabase = await createSupabaseAdmin();

    const {data: permissionData, error: permissionError} = await supabase
    .from("staff_permission")
    .select("*");

    if(permissionError){
        console.error("Failed to fetch permission");
        throw new Error("Failed to fetch");
    }

    return permissionData;
}


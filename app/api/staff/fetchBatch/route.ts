"use server";

import { checkPermission } from "@/lib/permission/checkPermission";
import { createSupabaseServerClient } from "@/lib/supbase/action";
import { count, error } from "console";
import { NextResponse } from "next/server";


export async function GET(){
    try{
        //1. check permission
        console.log("API Route Checking Permission....");

        const hasPermission = await checkPermission('batch.view');
        console.log("API Route Permission Result: ", hasPermission);

        if(!hasPermission){
            console.error("Permission Denied returning 403");
            return NextResponse.json(
                {
                    error: "Unauthorized missing batch.view permission",
                    status: 403,
                }
            )
        };

        console.log("Permission Granted, fetching batch data");
        // 2. Fetching batch datas
        const supabase = await createSupabaseServerClient();
        const {data, error} = await supabase
        .from("product_batches")
        .select("*");

        console.log("Product Batches Query Result: ",
            {
                error: error?.message,
                count: data?.length,
            }
        );

        if(error){
            console.log("Database error: ", error);
            return NextResponse.json({error: error.message}, {status: 500});
        }

        console.log("Product Associations fetching successfully...");
        return NextResponse.json({data, error: null});
        
    }catch(error){
        console.error("API Route Error: ", error);
        return NextResponse.json({error: error}, {status: 500});
    }
}
"use server";

import { fetchPermissionTable } from "@/app/functions/staff/permission/permission";
import { error } from "console";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const permissionDefault = await fetchPermissionTable();
        return NextResponse.json(permissionDefault);
    }catch{
        return NextResponse.json(error);
    }
}
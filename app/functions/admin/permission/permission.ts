"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";


//Fetching Permission Table Data
export async function fetchPermission() {
  const supabase = await createSupabaseAdmin();
  
  try {
    const { data: permissionData, error: permissionError } = await supabase
      .from("permission_table")
      .select("*");
    
    if (permissionError) {
      console.error("Failed to fetch permission data:", permissionError.message);
      throw permissionError; // Throw the actual error object
    }
    
    return permissionData;
  } catch (error) {
    console.error("Error fetching permission table:", error);
    throw error;
  }
}

//Fetch permission default
export async function fetchPermissionDefault(){
    const supabase = await createSupabaseAdmin();
    try{
        const {data: permissionDefault, error: permissionError} = await supabase
        .from("permission_default")
        .select('*');

        if(permissionError){
            console.error("Failed to fetch permission default table", permissionError);
            throw new Error("Error to fetch");
        }
        return permissionDefault;
    }catch(error){
        console.error("Failed to fetch permission default data", error);
        throw error;
    }
}

//fetch Staff Permission table
export async function fetchStaffPermissions(staff_id: string){
    const supabase = await createSupabaseAdmin();
    try{
        const {data: staffPermissionData, error: staffPermissionError} = await supabase
        .from("staff_permission")
        .select("staff_id")
        .eq("staff_id", staff_id);

        if(staffPermissionError || !staffPermissionData){
            console.error("Failed to fetch staff permission data", staffPermissionError);
            throw new Error("Failed to fetch");
        }

        return staffPermissionData;
    }catch(error){

    }
}
// Updating staff permission for all staffs
export async function updateAllStaffPermission(){
    const supabase = await createSupabaseAdmin();

    try{
        //1. fetch all permission defaults 
        const {data: permissionDefaults, error: fetchError} = await supabase
        .from("permission_default")
        .select("permission_id");

        if(fetchError){
            console.error("Failed to fetch permission defaults: ", fetchError);
            throw new Error("Error fetching permission defaults");
        }

        if(!permissionDefaults || permissionDefaults.length === 0){
            console.warn("No permission defaults found");
            return[];
        }

        //2. Get all staff IDs 
        const {data: allStaff, error: staffError} = await supabase
        .from("staff")
        .select("staff_id");


        if(staffError){
            console.error("Failed to fetch staff: ", staffError);
            throw new Error("Error fetching staff");
        }

        //3. delete all existing staff permissions
        const {error: deleteError} = await supabase
        .from("staff_permission")
        .delete()
        .eq('staff', "00000000-0000-0000-0000-000000000000");

        if(deleteError){
            console.error("Failed to delete existing staff permissions: ", deleteError);
            throw new Error("Error deleting existing permissions");
        }

        const {data: permissionTable, error: permissionError} = await supabase
        .from('permission_table')
        .select("permission_id");

        if(permissionError){
            console.error("Failed to fetch permission_table data");
            throw new Error("Failed to fetch");
        }

        //4. Prepare new staff permission records
        //For each staff member, insert all permission_ids from permission_table
        const newStaffPermissions = allStaff.flatMap((staff) => 
        permissionTable.map((perm) => ({
            staff_id: staff.staff_id,
            permission_id: perm.permission_id,
        })));

        //5. Insert new staff permissions
        const {data: insertedPermissios, error: insertError} = await supabase
        .from("staff_permission")
        .insert(newStaffPermissions)
        .select();

        if(insertError){
            console.error("Failed to insert new staff permissions: ", insertError);
            throw new Error("Error inserting new permissions");
        }

        console.log(`Successfully updated permissions for ${allStaff.length} staff members`);
        return insertedPermissios;

    }catch(error){
        console.error("Failed to update staff permissions: ", error);
        throw error;
    }
}


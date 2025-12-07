"use server";
import { createSupabaseServerClient } from "../supbase/action";

export async function checkPermission(permissionCode: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  console.log('1. User check:', { userId: user?.id, authError });
  
  if (authError || !user) {
    console.log('❌ No user authenticated');
    return false;
  }
  
  // Get staff record using auth_id
  const { data: staff, error: staffError } = await supabase
    .from('staff')
    .select('staff_id')
    .eq('auth_id', user.id)
    .single();
  
  console.log('2. Staff check:', { staff, staffError });
  
  if (!staff || staffError) {
    console.log('❌ No staff record found for auth_id:', user.id);
    return false;
  }
  
  // Get permission_id from permission_table using code
  const { data: permission, error: permError } = await supabase
    .from('permission_table')
    .select('permission_id')
    .eq('code', permissionCode)
    .single();
  
  console.log('3. Permission lookup:', { 
    permissionCode, 
    permission, 
    permError 
  });
  
  if (!permission || permError) {
    console.log('❌ Permission code not found:', permissionCode);
    return false;
  }
  
  // Check if this staff has this permission
  const { data: staffPermission, error: spError } = await supabase
    .from('staff_permission')
    .select('staff_permission_id')
    .eq('staff_id', staff.staff_id)
    .eq('permission_id', permission.permission_id)
    .single();
  
  console.log('4. Staff permission check:', { 
    staffId: staff.staff_id, 
    permissionId: permission.permission_id,
    staffPermission, 
    spError 
  });
  
  const hasPermission = !!staffPermission;
  console.log('5. ✅ Final result:', hasPermission);
  
  return hasPermission;
}

export async function requirePermission(permissionCode: string) {
  const hasPermission = await checkPermission(permissionCode);
  
  if (!hasPermission) {
    throw new Error(`Unauthorized: Missing permission '${permissionCode}'`);
  }
}

export async function getUserPermissions(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }
  
  // Get staff record
  const { data: staff } = await supabase
    .from('staff')
    .select('staff_id')
    .eq('auth_id', user.id)
    .single();
  
  if (!staff) {
    return [];
  }
  
  // Get all permission codes for this staff using JOIN
  const { data: staffPermissions } = await supabase
    .from('staff_permission')
    .select(`
      permission_id,
      permission_table!inner (
        code
      )
    `)
    .eq('staff_id', staff.staff_id);
  
  return staffPermissions?.map((sp: any) => sp.permission_table.code) || [];
}
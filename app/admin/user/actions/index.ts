"use server";
import { createSupabaseAdmin } from "@/lib/supbase/action";
import { Admin } from "@/type/membertype";


//Create new member
export async function createMember(data: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "staff" | "admin";
  status: "active" | "resigned";
  profile_image: string;
}) {
  const supabase = await createSupabaseAdmin();

  try {
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        display_name: data.name,
        role: data.role,
        status: data.status,
        profile_image: data.profile_image,
      },
    });

    if (userError) throw userError;
    if (!userData.user?.id) throw new Error("User ID is undefined after creation");

    const authId = userData.user.id;

    if (data.role === "admin") {
      const { data: adminData, error: adminError } = await supabase
        .from("admin")
        .insert({
          admin_id: data.id,
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          status: data.status,
          profile_image: data.profile_image,
        })
        .select("admin_id")
        .single();

      if (adminError) throw adminError;
      const adminId = adminData.admin_id;

      // 3️. Insert into member table
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({
          auth_id: authId,
          admin_id: adminId,
        });

      if (memberError) throw memberError;
      return memberData;

    } else if (data.role === "staff") {
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .insert({
          staff_id: data.id,
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          status: data.status,
          profile_image: data.profile_image,
        })
        .select("staff_id")
        .single();

      if (staffError) throw staffError;
      const staffId = staffData.staff_id;

      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({
          auth_id: authId,
          staff_id: staffId,
        });

      if (memberError) throw memberError;
      return memberData;
    }

    throw new Error("Invalid role provided");

  } catch (error: any) {
    console.error("Create member failed:", error);
    throw new Error(error.message || "Failed to create member!");
  }
}


// Fetch all Admins 
export async function fetchAdmins() {
  const supabase = await createSupabaseAdmin();

  const { data: adminData, error: adminError } = await supabase
    .from("admin")
    .select("*");

  if (adminError) {
    throw new Error(adminError.message);
  }

  return adminData;
}

// Update Admin Info
export async function updateAdmin(
  admin_id: string,
  data: Partial<{
    profile_image: string;
    email: string;
    name: string;
    password: string;
  }>
) {
  const supabase = await createSupabaseAdmin();

  const { data: adminData, error: adminError } = await supabase
    .from("admin") 
    .update(data)
    .eq("admin_id", admin_id)
    .select(); 

  if (adminError) {
    throw new Error(adminError.message);
  }

  return JSON.stringify(data);
}


//Fetch all Staffs
export async function fetchStaffs(){
    const supabase = await createSupabaseAdmin();

    const { data: staffData, error: staffError } = await supabase
    .from("staff")
    .select("*");

    if(staffError){
        throw new Error("Failed to fetch staff");
    }

    return staffData;
}

//Update Staff Info
export async function updateStaff(
    staff_id: string,
    payload: Partial<{
        profile_image: string;
        name: string;
        email: string;
        password: string;
    }>
){
    const supabase = await createSupabaseAdmin();

    const { data: staffData, error: staffError } = await supabase
    .from("staff")
    .update(payload)
    .eq("staff_id", staff_id)
    .single();

    if(staffError){
        throw new Error("Failed to update Staff Info");
    }

    return JSON.stringify(staffData);

}
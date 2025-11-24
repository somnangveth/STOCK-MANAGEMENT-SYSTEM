"use server";
import { createSupabaseAdmin } from "@/lib/supbase/action";
import { createSupabaseServerClient } from "@/lib/supbase/action";
import { revalidatePath } from "next/cache";
import { success } from "zod";


//Create new member
export async function createMember(data: {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff';
  profile_image: string;
  gender: 'Male' | 'Female';
  nationality: string;
  date_of_birth: Date;
  martial_status: string;
  primary_email_address: string;
  personal_email_address: string;
  primary_phone_number: string;
}) {
  const supabase = await createSupabaseAdmin();

  try {
    const display_name = data.first_name + "" +data.last_name;
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        display_name: display_name,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        profile_image: data.profile_image,
      },
    });

    if (userError) throw userError;
    if (!userData.user?.id) throw new Error("User ID is undefined after creation");

    const authId = userData.user.id;

    //Insert into contact_info table
    const {data: contactData, error: contactError} = await supabase
      .from("contact_info")
      .insert({
        primary_email_address: data.primary_email_address,
        personal_email_address: data.personal_email_address,
        primary_phone_number: data.primary_phone_number,
      })
      .select('contact_id')
      .single();

      const contactId = contactData?.contact_id;


    if (data.role === "admin") {

      //Insert into admin table
      const { data: adminData, error: adminError } = await supabase
        .from("admin")
        .insert({
          admin_id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          role: data.role,
          profile_image: data.profile_image,
          nationality: data.nationality,
          date_of_birth: data.date_of_birth,
          martial_status: data.martial_status,
          gender: data.gender,
          contact_id: contactId,
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

    } 
    //Insert into staff table
    else if (data.role === "staff") {

      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .insert({
          staff_id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          role: data.role,
          profile_image: data.profile_image,
          nationality: data.nationality,
          date_of_birth: data.date_of_birth,
          martial_status: data.martial_status,
          gender: data.gender,
          contact_id: contactId,
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

export async function fetchAuthUsers(id: string,){
  const supabase = await createSupabaseAdmin();

  const {data, error: userError} = await supabase.auth.admin.getUserById(id);

  if(userError){
    throw new Error("Failed to fetch AuthUsers data");
  }

  if(!data.user){
    throw new Error("Auth user not found");
  }

  return data.user;
}

export async function updateAdmin(
  admin_id: string,
  data: Partial<{
    profile_image: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    name: string;
  }>
) {
  try {
    // Get current authenticated user
    const authSupabase = await createSupabaseServerClient();
    
    // First check if we have a session at all
    const { data: { session }, error: sessionError } = await authSupabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("Session error:", sessionError);
      return { 
        success: false, 
        error: "No active session. Please log in again.",
        needsLogin: true 
      };
    }

    // Then get the user
    const { data: { user: currentUser }, error: userError } = await authSupabase.auth.getUser();
    
    if (userError || !currentUser) {
      console.error("User error:", userError);
      return { 
        success: false, 
        error: "Could not verify user. Please log in again.",
        needsLogin: true 
      };
    }

    console.log("Authenticated user:", currentUser.id);

    // Now proceed with admin operations
    const supabase = await createSupabaseAdmin();
    
    const authUpdate: any = {};
    
    if (data.email) {
      authUpdate.email = data.email;
    }
    if (data.password) {
      authUpdate.password = data.password;
    }

    const user_metadata: any = {};
    if (data.first_name !== undefined) user_metadata.first_name = data.first_name;
    if (data.last_name !== undefined) user_metadata.last_name = data.last_name;
    if (data.profile_image !== undefined) user_metadata.profile_image = data.profile_image;

    if (data.first_name !== undefined || data.last_name !== undefined) {
      const firstName = data.first_name || '';
      const lastName = data.last_name || '';
      user_metadata.display_name = `${firstName}${lastName ? ' ' + lastName : ''}`.trim();
    }

    if (Object.keys(user_metadata).length > 0) {
      authUpdate.user_metadata = user_metadata;
    }

    if (Object.keys(authUpdate).length > 0) {
      const { data: updatedUser, error: authError } = await supabase.auth.admin.updateUserById(
        currentUser.id,
        authUpdate
      );

      if (authError) {
        console.error("Auth update error:", authError);
        throw authError;
      }
      console.log("Auth updated successfully");
    }

    // Update profile data in database
    const profileData: any = {};
    if (data.profile_image !== undefined) profileData.profile_image = data.profile_image;
    if (data.email !== undefined) profileData.email = data.email;
    if (data.first_name !== undefined) profileData.first_name = data.first_name;
    if (data.last_name !== undefined) profileData.last_name = data.last_name;

    if (data.first_name !== undefined || data.last_name !== undefined) {
      const firstName = data.first_name || '';
      const lastName = data.last_name || '';
    }

    if (Object.keys(profileData).length > 0) {
      const { error: profileError } = await supabase
        .from('admin')
        .update(profileData)
        .eq('admin_id', admin_id);

      if (profileError) {
        console.error("Database update error:", profileError);
        throw profileError;
      }
      console.log("Database updated successfully");
    }

    return { success: true, needsRefresh: true };
  } catch (error: any) {
    console.error("Error updating admin:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update admin" 
    };
  }
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
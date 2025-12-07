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
  permissionIds?: string[]; // Add this parameter
}) {
  const supabase = await createSupabaseAdmin();

  try {
    const display_name = data.first_name + " " + data.last_name; 

    //1. Create Auth user
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

    //2. Insert into contact_info table
    const {data: contactData, error: contactError} = await supabase
      .from("contact_info")
      .insert({
        primary_email_address: data.primary_email_address,
        personal_email_address: data.personal_email_address,
        primary_phone_number: data.primary_phone_number,
      })
      .select('contact_id')
      .single();

    if(contactError){
      console.error('Contact insert error', contactError);
      throw contactError;
    }

    const contactId = contactData?.contact_id;

    if(!contactId){
      throw new Error("Contact ID is undefined after creation");
    }

    //3. Insert based on role
    if (data.role === "admin") {
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

      if(adminError){
        console.error('Admin insert error: ', adminError);
        throw adminError;
      }
      const adminId = adminData.admin_id;

      // Insert into member table
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({
          auth_id: authId,
          admin_id: adminId,
        });

      if (memberError){ 
        console.error('Member insert error: ', memberError);
        throw memberError;
      }

      return { 
        success: true, 
        data: memberData, 
        authId, 
        adminId 
      };

    } 
    else if (data.role === "staff") {
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .insert({
          staff_id: data.id,
          auth_id: authId,
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

      if (staffError){
        console.error("Failed to insert Staff", staffError);
        throw staffError;
      }
      const staffId = staffData.staff_id;

      // Insert into member table
      const { data: memberData, error: memberError } = await supabase
        .from("member")
        .insert({
          auth_id: authId,
          staff_id: staffId,
        });

      if (memberError){ 
        console.error('Failed to insert member', memberError);
        throw memberError;
      }

      

      return { 
        success: true, 
        data: memberData, 
        authId, 
        staffId 
      };
    }

    throw new Error("Invalid role provided");

  } catch (error: any) {
    console.error("Create member failed:", error);
    
    // Return error object instead of throwing for better error handling
    return {
      success: false,
      error: error.message || "Failed to create member!",
      details: error
    };
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



//Update Admin info
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


//Fetch Contact Info
export async function fetchContacts(){
  const supabase = await createSupabaseAdmin();

  const { data: contactData, error: contactError } = await supabase
  .from("contact_info")
  .select("*");

  if(contactError || !contactData){
    console.error("Failed to fetch data", contactError);
    throw new Error("Failed to fetch");
  }

  return contactData;
}

export async function deleteMember(user_id: string) {
  const supabase = await createSupabaseAdmin();

  try {
    // 1. First, get the member info to find related records
    const { data: member, error: fetchError } = await supabase
      .from("member")
      .select("id, auth_id, admin_id, staff_id")
      .eq("auth_id", user_id)
      .single();

    if (fetchError || !member) {
      console.error("Member not found:", fetchError);
      return { 
        success: false, 
        error: "Member not found" 
      };
    }

    // 2. Delete staff permissions if staff member (if not using CASCADE)
    if (member.staff_id) {
      const { error: permError } = await supabase
        .from("staff_permission")
        .delete()
        .eq("staff_id", member.staff_id);

      if (permError) {
        console.error("Error deleting staff permissions:", permError);
        // Continue anyway - might not exist
      }
    }

    // 3. Delete from member table first
    const { error: memberError } = await supabase
      .from("member")
      .delete()
      .eq("auth_id", user_id);

    if (memberError) {
      console.error("Error deleting member:", memberError);
      return { 
        success: false, 
        error: "Failed to delete member record" 
      };
    }

    // 4. Delete from staff or admin table
    if (member.staff_id) {
      const { error: staffError } = await supabase
        .from("staff")
        .delete()
        .eq("staff_id", member.staff_id);

      if (staffError) {
        console.error("Error deleting staff:", staffError);
        // Continue - may already be deleted by CASCADE
      }
    } else if (member.admin_id) {
      const { error: adminError } = await supabase
        .from("admin")
        .delete()
        .eq("admin_id", member.admin_id);

      if (adminError) {
        console.error("Error deleting admin:", adminError);
        // Continue - may already be deleted by CASCADE
      }
    }

    // 5. Finally, delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(user_id);

    if (authError) {
      console.error("Error deleting auth user:", authError);
      return { 
        success: false, 
        error: authError.message || "Failed to delete user authentication" 
      };
    }

    // 6. Revalidate the page to refresh data
    revalidatePath("/admin/members");
    revalidatePath("/members");

    return { 
      success: true, 
      message: "Member deleted successfully" 
    };

  } catch (error) {
    console.error("Delete member error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}
"use server";
import { createSupabaseServerClient } from "@/lib/supbase/action";
import { redirect } from "next/navigation";
import { createSupbaseServerClientReadOnly } from "@/lib/supbase/action";
// Login with Email and Password
export async function loginWithEmailAndPassword(data: { email: string; password: string }) {
  const supabase = await createSupabaseServerClient();

  const { data: loginData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin"); 
return JSON.stringify(loginData);
}

// Get Logged In User Info
export async function getLoggedInUser() {
  const supabase = await createSupbaseServerClientReadOnly();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

    if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  if (!user) return null;

  console.log("Auth User",user);

  return {
    id: user.id,
    profile_image: user.user_metadata?.profile_image || null,
    name: user.user_metadata?.display_name || null,
    email: user.email,
  };
}

// Log Out
export async function logOut() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error.message);
    throw new Error(error.message);
  }

  redirect("/auth"); // redirect after logout
}

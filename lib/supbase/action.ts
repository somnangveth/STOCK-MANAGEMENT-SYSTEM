"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";


export async function createSupbaseServerClientReadOnly() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				async get(name: string) {
					return cookieStore.get(name)?.value;
				},
			},
		}
	);
}
export async function createSupabaseServerClient(){
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                async set(name: string, value: string, options: CookieOptions){
                    cookieStore.set({name, value, ...options});
                },
                async remove(name: string, options: CookieOptions){
                    cookieStore.set({name, value:"",...options});
                }
            }
        }
    )
}

export async function createSupabaseAdmin(){
    if(!process.env.SERVICE_ROLE_KEY){
        throw new Error("SERVICE_ROLE_KEY is not defined in .env.local");
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE_KEY!,
    );
}
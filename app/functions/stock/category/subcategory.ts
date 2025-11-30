'use client';
import { createSupabaseAdmin } from "@/lib/supbase/action";

//Add Subcategory
export async function addSubcategory(data: {
subcategory_name: string;
category_id: string;
}){

    const supabase = await createSupabaseAdmin();

    const {data: subcategoryData, error: subcategoryError} = await supabase
    .from('subcategory')
    .insert({
        subcategory_name: data.subcategory_name,
        category_id: data.category_id,
    })
    .single();

    if(subcategoryError){
        console.error('Failed to insert a subcategory data', subcategoryError);
    }

    return subcategoryData;
}

//Update Subcategory
export async function updateSubcategory(
    subcategory_id: string,
    data: Partial<{
        subcategory_name: string;
        category_id: string;
    }>
){
    const supabase = await createSupabaseAdmin();

    const {data: subcategoryData, error: subcategoryError} = await supabase
    .from('subcategory')
    .update({
        subcategory_name: data.subcategory_name,
        category_id: data.category_id
    })
    .eq('subcategory_id', subcategory_id)
    .single();

    if(subcategoryError){
        console.error('Failed to update subcategory data', subcategoryError);
    }

    return subcategoryData;
}


//Delete Subcategory
export async function deleteSubcategory(subcategory_id: string){
    const supabase = await createSupabaseAdmin();

    const { data: subcategoryData, error: subcategoryError } = await supabase
    .from('subcategory')
    .delete()
    .eq('subcategory_id', subcategory_id)
    .single();

    if(subcategoryError){
        console.error('Failed to delete subcategory data: ', subcategoryError);
    }

    return subcategoryData;
}

//Fetch All Subcategory
export async function fetchSubcategory(){
    const supabase = await createSupabaseAdmin();

    const { data: subcategoryData, error: subcategoryError } = await supabase
    .from('subcategory')
    .select('*');

    if(subcategoryError){
        console.error('Failed to fetch Subcategory', subcategoryError);
    }

    return subcategoryData;
}
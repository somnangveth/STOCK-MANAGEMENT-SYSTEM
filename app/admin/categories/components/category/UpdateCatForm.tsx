'use client';

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Categories } from "@/type/productType";


export default function UpdateCategoryForm({category}:{category: Categories}){
    return(
        <DialogForm
        id="category-update-trigger"
        title="Update Category"
        Trigger={
            <button
            className="bg-blue-100 border border-blue-500 text-blue-500">
                Update
            </button>
        }
        form={<UpdateCategoryForm category = {category as Categories}/>}/>
    )
}
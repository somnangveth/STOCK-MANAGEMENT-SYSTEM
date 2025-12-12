'use client';

import DialogForm from "@/app/components/DialogForm";
import { btnStyle } from "@/app/components/Icons";
import { Categories } from "@/type/productType";


export default function UpdateCategoryForm({category}:{category: Categories}){
    return(
        <DialogForm
        id="category-update-trigger"
        title="Update Category"
        Trigger={
            <button
            className={btnStyle}>
                Update
            </button>
        }
        form={<UpdateCategoryForm category = {category as Categories}/>}/>
    )
}
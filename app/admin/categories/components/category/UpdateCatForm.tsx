'use client';

import DialogForm from "@/app/components/DialogForm";
import { btnStyle, edit } from "@/app/components/ui";
import { Categories } from "@/type/productType";
import UpdateCategory from "./UpdateCategory";
import { Button } from "@/components/ui/button";


export default function UpdateCategoryForm({category}:{category: Categories}){
    return(
        <DialogForm
        id="category-update-trigger"
        title="Update Category"
        Trigger={
            <Button
            className="text-blue-500 bg-transparent hover:bg-transparent hover:text-blue-700">
                {edit}
            </Button>
        }
        form={<UpdateCategory category = {category as Categories}/>}/>
    )
}
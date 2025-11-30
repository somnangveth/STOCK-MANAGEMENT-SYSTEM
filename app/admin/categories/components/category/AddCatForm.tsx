'use client';

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import AddCategory from "./AddCategory";

export default function AddCategoryForm(){
    return(
        <DialogForm
        id="cat-trigger"
        title="Add New Category"
        Trigger={
            <Button
            className="bg-blue-100 border border-blue-500 text-blue-500">
                + Add Category
            </Button>
        }
        form={<AddCategory/>}
        />
    )
}
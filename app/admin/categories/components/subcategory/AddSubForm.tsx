'use client';

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import AddSubcategory from "./AddSubcategory";
import { RxPlusCircled } from "react-icons/rx";

export default function AddSubcategoryForm(){
    return(
        <DialogForm
        id="create-sub-trigger"
        title="Create Subcategory"
        Trigger={
            <Button
            className="border border-blue-500 text-blue-500 bg-blue-100">
                <RxPlusCircled/> Subcategory
            </Button>
        }
        form={<AddSubcategory/>}/>
    )
}
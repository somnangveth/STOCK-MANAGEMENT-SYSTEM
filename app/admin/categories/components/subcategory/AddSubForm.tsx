'use client';

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import AddSubcategory from "./AddSubcategory";
import { RxPlusCircled } from "react-icons/rx";
import { btnStyle } from "@/app/components/Icons";

export default function AddSubcategoryForm(){
    return(
        <DialogForm
        id="create-sub-trigger"
        title="Create Subcategory"
        Trigger={
            <button
            className={btnStyle}>
                <RxPlusCircled/> Subcategory
            </button>
        }
        form={<AddSubcategory/>}/>
    )
}
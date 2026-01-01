'use client';

import DialogForm from "@/app/components/DialogForm";
import AddCategory from "./AddCategory";
import { RxPlusCircled } from "react-icons/rx";
import { btnStyle } from "@/app/components/Icons";

export default function AddCategoryForm(){
    return(
        <DialogForm
        id="cat-trigger"
        title="Add New Category"
        Trigger={
            <button
            className={btnStyle}>
                <RxPlusCircled/> Category
            </button>
        }
        form={<AddCategory/>}
        />
    )
}
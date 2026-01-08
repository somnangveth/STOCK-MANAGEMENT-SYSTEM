"use client";

import DialogForm from "@/app/components/DialogForm";
import { edit, EditIconBtn } from "@/app/components/ui";
import { Button } from "@/components/ui/button";
import { Attribute } from "@/type/productType";
import UpdateAttribute from "./UpdateAttribute";

export default function UpdateAttributeForm({attributes}:{attributes: Attribute[]}){
    return(
        <DialogForm
        id="update-attribute"
        title="Update Product Attribute"
        Trigger={
            <Button
            className={EditIconBtn}>
                {edit}
            </Button>
        }
        form={<UpdateAttribute attributes={attributes}/>}/>
    )
}
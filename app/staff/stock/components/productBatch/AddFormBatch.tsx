"use client";

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Product } from "@/type/productType";
import { RxPlusCircled } from "react-icons/rx";
import AddBatch from "./AddBatch";
import { EditIconBtn, faPlusCircle } from "@/app/components/ui";

export default function AddFormBatch({product}:{product: Product}){
return(
    <DialogForm
    id="add-batch-trigger"
    title="Add New Batch"
    Trigger={
        <Button className={EditIconBtn}>
            {faPlusCircle}
        </Button>
    }
    form={<AddBatch product={product as Product}/>}/>
)
}
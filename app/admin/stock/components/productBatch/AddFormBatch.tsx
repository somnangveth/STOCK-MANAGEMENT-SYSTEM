"use client";

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Product } from "@/type/productType";
import { RxPlusCircled } from "react-icons/rx";
import AddBatch from "./AddBatch";

export default function AddFormBatch({product}:{product: Product}){
return(
    <DialogForm
    id="add-batch-trigger"
    title="Add New Batch"
    Trigger={
        <Button className="text-blue-500 bg-transparent">
            <RxPlusCircled/>
        </Button>
    }
    form={<AddBatch product={product as Product}/>}/>
)
}
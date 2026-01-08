"use client";

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Product, ProductBatch } from "@/type/productType";
import AddBatch from "./AddBatch";
import { edit, EditIconBtn, faPlusCircle } from "@/app/components/ui";
import UpdateBatch from "./UpdateBatch";

export default function UpdateBatchForm({product, batch}:{product: Product, batch: ProductBatch}){
return(
    <DialogForm
    id="update-batch"
    title="Update Batch"
    Trigger={
        <Button className={EditIconBtn}>
            {edit}
        </Button>
    }
    form={<UpdateBatch
         batch={batch}
         product={product}/>}/>
)
}
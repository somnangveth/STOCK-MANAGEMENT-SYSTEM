"use client";

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Product, StockAlert } from "@/type/productType";
import UpdateStockLevel from "./UpdateStockLevel";
import { edit, EditIconBtn } from "@/app/components/ui";

export default function UpdateStockLevelForm({stockAlert, product}:{stockAlert: StockAlert, product: Product}){
    return(
        <DialogForm
        id="update-stockLevel"
        title="Update Stock Level"
        Trigger={
        <Button
        className={EditIconBtn}>
            {edit}
        </Button>}
        form={<UpdateStockLevel stockAlert={stockAlert} product={product}/>}/>
    )
}
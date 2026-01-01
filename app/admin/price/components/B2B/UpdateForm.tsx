"use client";

import DialogForm from "@/app/components/DialogForm";
import { PriceProductProps } from "../B2C/UpdateForm";
import { Button } from "@/components/ui/button";
import { edit, EditIconBtn } from "@/app/components/ui";
import UpdateSinglePriceB2B from "./UpdatePrice";

export default function UpdatePriceFormB2B({priceData}:{priceData: PriceProductProps}){
    return(
        <DialogForm
        id="update-price-b2b"
        title="Update Price B2B"
        Trigger = {
            <Button
            className={EditIconBtn}>
                {edit}
            </Button>
        }
        form = {<UpdateSinglePriceB2B priceData={priceData}/>}/>
    )
}
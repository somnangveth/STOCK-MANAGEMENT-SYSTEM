"use client";

import DialogForm from "@/app/components/DialogForm";
import { edit, EditIconBtn } from "@/app/components/ui";
import { Button } from "@/components/ui/button";
import { Price, Product} from "@/type/productType";
import UpdateSinglePriceB2C from "./UpdatePrice";

export interface PriceProductProps {
    price_id: string;
    total_price?: number;
    b2b_price?: number;
    discount: number;
    shipping: number;
    profit_price: number;
    tax: number;
    base_price: number;
    product: Product,
}
export default function UpdatePriceFormB2C({priceData}: {priceData: PriceProductProps}){
    return(
        <DialogForm
        id="update-price"
        title="Update Price Details"
        Trigger={
            <Button
            className={EditIconBtn}>
                {edit}
            </Button>
        }
        form={<UpdateSinglePriceB2C priceData={priceData}/>}/>
    )
}
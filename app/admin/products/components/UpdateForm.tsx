'use client';
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Product } from "@/type/productType";
import UpdateProduct from "./UpdateProduct"; // Import the actual form component
import { edit } from "@/app/components/ui";

export default function UpdateForm({product}: {product: Product}){
    return(
        <DialogForm
            id="update-trigger"
            title="Update Product"
            Trigger={
                <button
                    className="
                        w-10 h-5 text-sm bg-transparent text-blue-500 rounded-xl">
                    {edit}
                </button>
            }
            form = {<UpdateProduct product={product}/>}
        />
    )
}
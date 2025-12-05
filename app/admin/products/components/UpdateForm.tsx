'use client';
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Product } from "@/type/productType";
import UpdateProduct from "./UpdateProduct"; // Import the actual form component

export default function UpdateForm({product}: {product: Product}){
    return(
        <DialogForm
            id="update-trigger"
            title="Update Product"
            Trigger={
                <Button
                    className="
                        border border-blue-700
                        bg-blue-100 text-blue-700
                        hover:bg-blue-700 hover:text-blue-50">
                    Edit
                </Button>
            }
            form = {<UpdateProduct product={product}/>}
        />
    )
}
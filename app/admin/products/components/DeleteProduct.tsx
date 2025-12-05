'use client';

import { deleteProduct } from "@/app/functions/stock/product/product";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/type/productType";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteProduct({product}: {product: Product}){
    const [open, setOpen] = useState(false);

    async function handleDelete(){
        try{
            const res = await deleteProduct({product});
            const result = JSON.parse(res);

            if(result.error){
                console.error('Failed to delete: ',result.error);
                toast.error('Failed to delete book');
            }else{
                toast.success('Book deleted successfully');
                setOpen(false);
            }
        }catch(error){
            console.error('Delete error: ', error);
            toast.error('Something went wrong while deleting');
        }
    }

    return(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                className="
                h-7 w-15
                bg-red-200 text-red-700
                border border-red-700 text-sm
                rounded-xl
                hover:bg-red-500 hover:text-red-100">
                    Delete
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-red-700">
                        Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete
                        <span className="font-semibold text-indigo-700">
                            {product.product_name}
                        </span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel className="border border-gray-300 hover:bg-gray-100 rounded-xl">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-200 border-2 border-red-700 rounded-xl text-red-700">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
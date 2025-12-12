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
import { deleteImage } from "@/app/components/Image/actions/upload";
import { trash } from "@/app/components/Icons";

export default function DeleteProduct({product}: {product: Product}){
    const [open, setOpen] = useState(false);

    async function deleteProductImage(oldImage?: string){
        try{
            if(oldImage){
                await deleteImage({imageUrl: oldImage, bucket: 'images'})
            }
            console.log("Image deleted Successfully!");
        }catch(error){
            console.error(JSON.stringify({error: "Failed to delete image"}));
        }
    }
    async function handleDelete(){
        try{
            await deleteProductImage(product.product_image);
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
                w-11 h-5 text-sm bg-transparent text-red-500 rounded-xl">
                    {trash}
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
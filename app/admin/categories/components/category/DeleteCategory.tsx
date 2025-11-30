'use client';

import { deleteCategory } from "@/app/functions/stock/category/category";
import { AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Categories } from "@/type/productType";
import { useState } from "react";

export default function DeleteCategoryForm({category}:{category: Categories}){
    const [ open , setOpen ] = useState(false);

    async function handleDelete(){
        try{
            const res = await deleteCategory(category.category_id);
            const result = typeof res === 'string' ? JSON.parse(res) : res;
            const {error} = result;

            if(error){
                console.error('Failed to delete', error);
            }
        }catch(error){
            console.error('Failed to delete category', error);
        }
    }
    return(
        <AlertDialog open={open} onOpenChange={setOpen} >
            <AlertDialogTrigger asChild>
                <Button
                className="h-7 w-15 bg-red-200 text-red-700 border border-red-700 text-sm rounded-xl hover:bg-red-500 hover:text-red-100">
                    Delete
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-red-700">
                        Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDescription>
                        Are you sure you want to delete?
                    </AlertDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                    className="border border-gray-300 hover:bg-gray-100 rounded-xl">
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
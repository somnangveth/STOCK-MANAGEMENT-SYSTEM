"use client";

import DialogForm from "@/app/components/DialogForm";
import { PermissionGate } from "@/app/components/permission/PermissionGate";
import { btnStyle } from "@/app/components/ui";
import { Button } from "@/components/ui/button";
import AddCategoryStaff from "./AddCategory";

export default function AddCategoryFormStaff(){
    return(
    <PermissionGate
        permission="category.create"
      loadingFallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="ml-3 text-gray-500">Checking permissions...</p>
        </div>
      }
      fallback={
        <>
        </>
      }
        >
            <DialogForm
            id="create-category"
            title="Create Category"
            Trigger = {
                <Button
                className={btnStyle}>
                    Create Category
                </Button>
            }
            form={<AddCategoryStaff/>}/>
        </PermissionGate>
    )
}
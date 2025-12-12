"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import CreateVendors from "./CreateVendor";
import { plusCircle } from "@/app/components/Icons";

export default function VendorForm({
    onVendorAdded
}:{
    onVendorAdded?: () => void
}){
    return(
        <DialogForm
        id="vendor-trigger"
        title="Create Vendor"
        Trigger ={
            <Button
            className="border border-blue-700 bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-blue-50">
                {plusCircle} Add Vendors
            </Button>
        }
        form={<CreateVendors onSuccess={onVendorAdded}/>}
        />
    )
}
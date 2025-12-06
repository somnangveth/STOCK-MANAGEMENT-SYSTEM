"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import CreateVendors from "./CreateVendor";
import { btnStyle, plusCircle } from "@/app/components/Icons";

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
            <button
            className={btnStyle}>
                {plusCircle} Add Vendors
            </button>
        }
        form={<CreateVendors onSuccess={onVendorAdded}/>}
        />
    )
}
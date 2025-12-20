"use client";
import ReceiptCard from "@/app/components/catalog/ReceiptCard";
import DialogForm from "@/app/components/DialogForm";
import { view } from "@/app/components/Icons";
import { Button } from "@/components/ui/button";
export default function ReceiptForm(){
    return(
        <DialogForm
        id=""
        title=""
        Trigger = {
            <Button className="text-blue bg-gray-50  rounded-full">
                {view}
            </Button>
        }
        form={<ReceiptCard/>}/>
    )
}
"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import MemberForm from "./CreateMember";
import { btnStyle } from "@/app/components/Icons";


export default function CreateForm(){
    return(
        <DialogForm
        id="create-trigger"
        Trigger = {
            <Button
            className={btnStyle}
            >
                + Add New Users
            </Button>
        }
        form = {<MemberForm/>}
        />
    )
}
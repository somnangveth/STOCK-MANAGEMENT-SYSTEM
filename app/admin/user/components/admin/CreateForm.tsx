"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import MemberForm from "./CreateMember";


export default function CreateForm(){
    return(
        <DialogForm
        id="create-trigger"
        title="Create Member"
        Trigger = {
            <Button
            className="
            text-blue-700
            border border-blue-500
            bg-blue-100
            rounded-xl p-1
            hover:bg-blue-500 hover:text-white"
            >
                + Add New Users
            </Button>
        }
        form = {<MemberForm/>}
        />
    )
}
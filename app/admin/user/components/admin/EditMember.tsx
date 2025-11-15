"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Admin } from "@/type/membertype";
import EditAdmin from "./EditForm";


export default function EditMember({admin}: {admin: Admin}){
    return(
        <DialogForm
        id="trigger"
        title="Create Member"
        Trigger = {
            <Button
            className="
            text-blue-700
            border border-blue-500
            bg-blue-100
            px-5
            rounded-xl p-1
            hover:bg-blue-500 hover:text-white"
            >
                Edit
            </Button>
        }
        form = {<EditAdmin admin={admin}/>}
        />
    )
}
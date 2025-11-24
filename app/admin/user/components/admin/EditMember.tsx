"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Admin } from "@/type/membertype";
import EditAdmin from "./EditForm";


export default function EditMember({admin}: {admin: Admin}){
    return(
        <DialogForm
        id="trigger"
        Trigger = {
            <Button
            className="
            font-semibold
            text-blue-700
            bg-blue-100
            px-10
            rounded-xl
            hover:bg-blue-500 hover:text-white"
            >
                Edit
            </Button>
        }
        form = {<EditAdmin admin={admin}/>}
        />
    )
}
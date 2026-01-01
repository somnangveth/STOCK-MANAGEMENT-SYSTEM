"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Admin } from "@/type/membertype";
import EditAdmin from "./EditForm";
import { edit } from "@/app/components/ui";

export default function EditMember({admin}: {admin: Admin}){
    return(
        <DialogForm
        id="trigger"
        Trigger = {
            <Button
            className="
            w-10 h-5 text-sm bg-transparent text-blue-500 rounded-xl hover:bg-transparent hover:text-blue-500"
            >
                {edit}
            </Button>
        }
        form = {<EditAdmin admin={admin}/>}
        />
    )
}
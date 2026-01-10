"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Staff } from "@/type/membertype";
import EditForm from "./EditForm";
import { FaPen } from "react-icons/fa";

export default function EditStaff({staff}: {staff: Staff}){
    return(
        <DialogForm
        id="staff-trigger"
        title="Edit Staff Info"
        Trigger ={ 
            <Button
            className="w-10 h-5 text-sm  bg-transparent text-blue-500 rounded-xl"
            >
               <FaPen/>
            </Button>
        }

        form = {<EditForm staff={staff}/>}
        />

    )
}
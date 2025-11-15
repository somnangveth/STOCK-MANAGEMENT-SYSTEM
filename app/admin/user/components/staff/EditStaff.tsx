"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Staff } from "@/type/membertype";
import EditForm from "./EditForm";

export default function EditStaff({staff}: {staff: Staff}){
    return(
        <DialogForm
        id="staff-trigger"
        title="Edit Staff Info"
        Trigger ={ 
            <Button
            className="border border-blue-700 bg-blue-100 text-blue-700 rounded-xl"
            >
                Edit
            </Button>
        }

        form = {<EditForm staff={staff}/>}
        />

    )
}
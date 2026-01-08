"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Contact } from "@/type/membertype";
import EditAdmin from "./EditForm";
import { edit, EditIconBtn } from "@/app/components/ui";
import UpdateContact from "./UpdateContact";

export default function UpdateContactForm({contact}: {contact: Contact}){
    return(
        <DialogForm
        id="update-contact"
        Trigger = {
            <Button
            className={EditIconBtn}
            >
                {edit}
            </Button>
        }
        form = {<UpdateContact contact={contact}/>}
        />
    )
}
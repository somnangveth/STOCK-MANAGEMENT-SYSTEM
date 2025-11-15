"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { RxGear } from "react-icons/rx";
import ProfilePage from "./ProfilePage";

export default function ProfileDialog(){
    return(
        <DialogForm
        id="profile-setting"
        title="Profile Setting"
        Trigger = {
            <Button 
            className="bg-transparent hover:bg-transparent">
                <RxGear className="text-black hover:text-black"/>
            </Button>
        }
        form = {<ProfilePage/>}
        />
    )
}
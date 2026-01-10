"use client";
import DialogForm from "@/app/components/DialogForm";
import { RxGear } from "react-icons/rx";
import ProfilePage from "./ProfilePage";

export default function ProfileDialog(){
    return(
        <DialogForm
        id="profile-setting"
        title="Profile Setting"
        Trigger = {
            <button
            className="bg-transparent hover:bg-transparent">
                <RxGear className="text-black hover:text-black"/>
            </button>
        }
        form = {<ProfilePage/>}
        />
    )
}
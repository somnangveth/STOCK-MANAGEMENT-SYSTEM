"use client";
import ProfileDialog from "../user/components/profile/ProfileDialog";
import NavLinks from "./NavLink";
import { cn } from "@/lib/utils";

export const SideBar = () => {
    return(
        <div className="h-full sm:w-52 xl:w-64 space-y-5 flex flex-col">
            <div className="flex-1 space-y-5">
                <div className="flex items-center gap-2 flex-1 justify-center p-3 bg-blue-100">
                    <h1>Admin Dashboard</h1>
                </div>
                <NavLinks/>
            </div>
            <div className="flex justify-end mt-125">
                <ProfileDialog/>
            </div>
        </div>
    )
}
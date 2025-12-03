"use client";
import ProfileDialog from "../profile/ProfileDialog";
import NavLinks from "./NavLink";

export const SideBar = () => {
    return(
        <div className="sm:w-52 xl:w-64 space-y-5 flex flex-col bg-[#e9dbbc]">
            <div className="flex-1 space-y-5">
                <div className="
                flex items-center 
                gap-2 flex-1 justify-center 
                p-3 text-amber-500 font-bold">
                    <h1>Admin Dashboard</h1>
                </div>
                <NavLinks/>
            </div>
            <div className="flex justify-end mt-80">
                <ProfileDialog/>
            </div>
        </div>
    )
}
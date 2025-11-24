"use client";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateForm from "../admin/CreateForm";
import AdminList from "../admin/AdminList";
import StaffList from "../staff/StaffList";
import { Admin, Staff } from "@/type/membertype";

export default function FilterMember({admin, staff}: {admin: Admin, staff: Staff}){
const [selected, setSelected] = useState("admin");
return(
    <div className="mt-10">
        <div className="flex justify-between">
            <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder = "Select member type"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="staff">Staffs</SelectItem>
            </SelectContent>
        </Select>
        <CreateForm/>
        </div>

        {selected === "admin" ? <AdminList admin={admin}/> : <StaffList staff={staff}/>}
    </div>
)
}
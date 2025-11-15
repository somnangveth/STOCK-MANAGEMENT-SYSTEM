"use client";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminCatalog from "../admin/AdminCatalog";
import StaffCatalog from "../staff/StaffCatalog";
import CreateForm from "../admin/CreateForm";

export default function FilterMember(){
const [selected, setSelected] = useState("admin");
return(
    <div>
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

        {selected === "admin" ? <AdminCatalog/> : <StaffCatalog/>}
    </div>
)
}
"use client";

import { useQueries } from "@tanstack/react-query";
import { Admin, Staff } from "@/type/membertype";
import BarGraph from "../chart/bargraph";
import CircleGraph from "../chart/circleGraph";


export default function TotalUsersCatalog(){

    async function fetchStaffs(){
        const res = await fetch("/api/admin/fetchStaffs");
        if(!res.ok) throw new Error("Failed to fetch Staffs Data");
        return res.json();
    }

    async function fetchAdmins(){
        const res = await fetch("/api/admin/fetchMembers");
        if(!res.ok) throw new Error("Failed to fetch Admins Data");
        return res.json();
    }

    const result = useQueries({
        queries:[
            {
                queryKey: ["fetchAdmins"],
                queryFn: fetchAdmins,
            },
            {
                queryKey: ["fetchStaffs"],
                queryFn: fetchStaffs,
            }
        ]
    });

    const adminQuery = result[0];
    const staffQuery = result[1];

    if(!adminQuery|| adminQuery.error){
        console.error("Failed to fetch Admin datas");
        return <p>Failed to fetch Admin data.</p>;
    }

    if(!staffQuery|| staffQuery.error){
        console.error("Failed to fetch Admin datas");
        return <p>Failed to fetch Staff data.</p>;
    }

    if(adminQuery.isLoading || staffQuery.isLoading){
        return <p>Loading...</p>;
    }

    const admins: Admin[] = adminQuery.data ?? [];
    const staffs: Staff[] = staffQuery.data ?? [];

    const totalAdmin = admins.length;
    const totalStaff = staffs.length;

    const chartData = [
        {admin: totalAdmin, staff: totalStaff}
    ]
    return(
        <div className="border p-3 border-gray-300 rounded-lg">
        <CircleGraph
        data={chartData}
        dataKeys={["admin", "staff"]}
        circleColor={["#3a82f6", "#21a241"]}
        />
        </div>
    )
}
"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Admin, Staff } from "@/type/membertype";
import MemberCatalog from "@/app/components/MemberCatalog";
import EditForm from "./EditForm";
import EditStaff from "./EditStaff";

export default function StaffCatalog(){
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isloading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStaffs(){
            try{
                const res = await fetch("/api/fetchStaffs", {cache: "no-store"});

                if(!res.ok){
                    toast.error("Failed to load data");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setStaffs(data);
            }catch(error){
                toast.error("Something went wrong fetching Staffs");
            }finally{
                setLoading(false);
            }
        }

        startTransition(() => loadStaffs());
    }, []);

    if (isloading || isPending) {
    return (
      <div className="flex justify-center items-center mt-10 text-gray-600">
        <AiOutlineLoading3Quarters className="animate-spin mr-2" />
        <p>Loading Staff...</p>
      </div>
    );
  }

  return(
    <div>
        <h2>Staff</h2>

        {staffs.length === 0 ? (
            <p>No Staff Found</p>
        ): (
            <div>
                {staffs.map((staff) => (
                    <MemberCatalog 
                    key={staff.staff_id}
                    id={staff.staff_id}
                    name={staff.name} 
                    email={staff.email} 
                    profile_image={staff.profile_image} 
                    role={staff.role} status={staff.status}
                    editform = {<EditStaff staff={staff}/>} />
                ))}
            </div>
        )}
    </div>
  )

}


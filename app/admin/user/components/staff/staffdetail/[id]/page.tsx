"use client";

import MemberDetailCatalog from "@/app/components/catalog/memberDetailCatalog";
import { cn } from "@/lib/utils";
import { Staff } from "@/type/membertype";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function StaffDetailPage(){
    const param = useParams();
    const id = param.id;

    //Fetch Staff Info
    async function fetchStaffs(){
        const res = await fetch('/api/admin/fetchStaffs');
        if(!res.ok){
            console.log("Failed to fetch staff data");
            throw new Error("Failed to fetch");
        }
        return res.json();
    }

    //Fetch Contact Info
    async function fetchContact(){
        const res = await fetch('/api/admin/fetchContact');
        if(!res.ok){
            console.log("Failed to fetch contact data");
            throw new Error("Failed to fetch");
        }

        return res.json();
    }

    const result = useQueries({
        queries: [
            {
                queryKey: ['query-staff'],
                queryFn: fetchStaffs,
            },
            
            {
                queryKey: ['queryContact'],
                queryFn: fetchContact,
            }
        ]
    });

    const staffData = result[0].data;
    const contactData = result[1].data;
    const isLoading = result[0].isLoading || result[1].isLoading;
    const hasError = result[0].error || result[1].error;

    const currentStaff = useMemo(() => {
        if(!staffData || !id) return null;
        return staffData.find((staff: Staff) => staff.staff_id === id);
    }, [staffData, id]);

    const currentContact = useMemo(() => {
        if(!currentStaff || !contactData) return null;
        return contactData.find((contact: any) => contact.contact_id === currentStaff.contact_id);
    }, [contactData, currentStaff]);
    

    if(isLoading){
        return <p className="text-gray-500 flex items-center justify-center">Loading data <AiOutlineLoading3Quarters className={cn("animate-spin")}/></p>
    }

    if(hasError){
        return <p className="text-gray-500 flex items-center justify-center">Failed to fetch data</p>
    }

    if(!currentStaff){
        return <p className="text-gray-500 flex items-center justify-center">No Staff Found.</p>
    }
    return(
        <div>
            <MemberDetailCatalog staff={currentStaff} contact={currentContact}/>
        </div>
    )
}
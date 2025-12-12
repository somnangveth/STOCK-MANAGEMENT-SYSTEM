"use client";

import MemberDetailCatalog from "@/app/components/catalog/memberDetailCatalog";
import { Admin } from "@/type/membertype";
import { useQueries } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function AdminDetailPage(){

    const param = useParams();
    const id = param.id as string;

    //Fetch Admins Info
    async function fetchAdmins(){
        const res = await fetch('/api/admin/fetchMembers') ;
        if(!res.ok){
            console.error("Failed to fetch Admins Data");
            throw new Error("Failed to fetch");
        }
        return res.json();
    }

    //Fetch Contacts Info
    async function fetchContacts(){
        const res = await fetch('/api/admin/fetchContact');
        if(!res.ok){
            console.error("Failed to fetch contact datas");
            throw new Error("Failed to fetch");
        }

        return res.json();
    }

    const result = useQueries(
        {
            queries: [
                {
                    queryKey: ["admin-query"],
                    queryFn: fetchAdmins,
                },
                {
                    queryKey: ["contact-query"],
                    queryFn: fetchContacts,
                }
            ]
        }
    );

    const adminData = result[0].data;
    const contactData = result[1].data;
    const isLoading = result[0].isLoading || result[1].isLoading;
    const hasError = result[0].error || result[1].error;

    const currentAdmin = useMemo(() => {
        if(!adminData || !id) return null;
        return adminData.find((admin: Admin) => admin.admin_id === id);
    }, [adminData, id]);

    const currentContact = useMemo(() => {
        if(!contactData || !currentAdmin) return null;
        return contactData.find((contact: any) => contact.contact_id === currentAdmin.contact_id);
    }, [contactData, currentAdmin]);

    if(isLoading){
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    if(hasError){
        return(
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-red-600">Error loading data, please try again.</p>
        </div>
        )
    }

    if(!currentAdmin){
        return(
            <div className="flex items-center justify-center min-h-screen">
                <p>Admin not found.</p>
            </div>
        )
    }

    return (
    <div>
        <MemberDetailCatalog admin={currentAdmin} contact={currentContact}/>
    </div>
    )
}
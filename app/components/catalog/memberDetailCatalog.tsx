"use client";

import DeleteMember from "@/app/admin/user/components/admin/DeleteMember";
import { Admin, Contact, Staff } from "@/type/membertype";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MemberDetailCatalog({
    admin,
    staff,
    contact,
}: {
    admin?: Admin;
    staff?: Staff;
    contact: Contact;
}){
        const [activeTab, setActiveTab] = useState<"basic" | "experience">("basic");

        const BasicInfoPanel = () => (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500 font-medium">Firstname: </p>
                    <p className="text-base mt-1">{admin?.first_name || staff?.first_name || "N/A"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Lastname:</p>
                    <p className="text-base mt-1">{admin?.last_name || staff?.last_name || "N/A"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Gender:</p>
                    <p className="text-base mt-1">{admin?.gender || staff?.gender || "N/A"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Email: </p>
                    <p className="text-base mt-1">{admin?.email || staff?.email || "N/A"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">ID: </p>
                    <p className="text-base mt-1">{admin?.admin_id || staff?.staff_id || "N/A"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Phone Number 1: </p>
                    <p className="text-base mt-1">{admin?.phone_number1 || staff?.phone_number1 || "N/A"}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Phone Number 2:</p>
                    <p className="text-base mt-1">{admin?.phone_number2 || staff?.phone_number2 || "N/A"}</p>
                </div>

                {contact && (
                    <>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Primary Email Address: </p>
                        <p className="text-base mt-1">{contact.primary_email_address || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Personal Email Address: </p>
                        <p className="text-base mt-1">{contact.personal_email_address || "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Primary Phonenumber: </p>
                        <p className="text-base mt-1">{contact.primary_phone_number || "N/A"}</p>
                    </div>
                    </>
                )}
            </div>
        </div>
    );


    const ExperiencePanel = () => (
        <div className="p-6">
            <p className="text-gray-500">No experience data available</p>
        </div>
    )

        return (
    <div>
        <div className="border-b border-gray-600 p-2 flex justify-between">
            <Link href="/admin/user"><ArrowLeftIcon/></Link>
            <p>{admin?.first_name || staff?.first_name} 's Info</p>
        </div>
        <div className="flex p-5 border border-gray-500 m-3 rounded-lg">
            {admin?.profile_image || staff?.profile_image ? (
                <img src={admin?.profile_image || staff?.profile_image} alt={admin?.first_name || staff?.first_name} className="w-[200px] h-[200px] " />
            ):(
                <img src="/assets/default.jpg" alt="default" className="w-[200px] h-[200px] " />
            )}

            <div className="flex flex-col p-4">
            <h1 className="text-2xl font-bold ">{admin?.first_name|| staff?.first_name} {admin?.last_name || staff?.last_name}</h1>
            <p className="text-gray-500 text-sm ">ID: {admin?.admin_id || staff?.staff_id}</p>
            <p className="text-gray-500 text-sm ">{admin?.role || staff?.role}</p>
            <p className="text-gray-500 text-sm ">Email: {admin?.email || staff?.email}</p>
            </div>

            <div>
                
            </div>

        </div>

        <div className="flex flex-col gap-5 border-gray-500 mt-10">
            <div className="border-b border-gray-200">
                <button 
                onClick={() => setActiveTab("basic")}
                className={`flex-1 px-6 py-3 text-sm font-medium transitio-colors 
                    ${
                        activeTab === "basic"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    Basic Info
                </button>
                <button 
                onClick={() => setActiveTab("experience")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "experience"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
                >
                    Experience
                </button>
            </div>

            {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "basic" ? <BasicInfoPanel /> : <ExperiencePanel />}
          </div>
        </div>
    </div>
    )
}
"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import EditMember from "./EditMember";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Admin } from "@/type/membertype";
import MemberCatalog from "@/app/components/MemberCatalog";

export default function AdminCatalog() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadAdmins() {
      try {
        const res = await fetch("/api/fetchMembers", { cache: "no-store" });

        if (!res.ok) {
          toast.error("Failed to load admins");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAdmins(data); 
      } catch (err) {
        toast.error("Something went wrong fetching admins");
      } finally {
        setLoading(false);
      }
    }

    startTransition(() => loadAdmins());
  }, []);

  if (loading || isPending) {
    return (
      <div className="flex justify-center items-center mt-10 text-gray-600">
        <AiOutlineLoading3Quarters className="animate-spin mr-2" />
        <p>Loading admins...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 space-y-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Admins</h2>

      {admins.length === 0 ? (
        <p className="text-gray-500 italic">No admins found.</p>
      ) : (
        <div className="gap-6 space-y-2">
          {admins.map((admin) => (
            <MemberCatalog 
            key={admin.admin_id}
            id={admin.admin_id} 
            name={admin.name} 
            email={admin.email} 
            role={admin.role} 
            status={admin.status} 
            profile_image={admin.profile_image} 
            editform={<EditMember admin={admin}/>}/>
          ))}
        </div>
      )}
    </div>
  );
}

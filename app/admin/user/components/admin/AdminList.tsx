"use client";
import { Admin } from "@/type/membertype";
import { useEffect, useState } from "react";
import { fetchAdmins } from "../../actions";
import MemberTable from "@/app/components/Tables/memberTable";
import EditMember from "./EditMember";

export default function AdminList({admin}: {admin: Admin}) {
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const data = await fetchAdmins();
        setAdmins(data);
      } catch (error: any) {
        throw new Error("Failed to fetch Admin Data", error.message);
      }
    }
    loadAdmin();
  }, []);

  return (
    <div className="overflow-x-auto">
      <MemberTable
        members={admins}
        columns={["admin_id", "profile_image", "first_name", "last_name", "email", "gender", "action"]}
        form={(admin) => <EditMember admin={admin as Admin} />}
      />
    </div>
  );
}
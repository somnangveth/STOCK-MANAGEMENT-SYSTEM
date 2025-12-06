"use client";
import { Admin } from "@/type/membertype";
import { useEffect, useState } from "react";
import { fetchAdmins } from "../../actions";
import MemberTable from "@/app/components/Tables/memberTable";
import EditMember from "./EditMember";
import Link from "next/link";
import { view } from "@/app/components/Icons";
import DeleteMember from "./DeleteMember";

export default function AdminList() {
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
      itemsPerPage={5}
        members={admins}
        columns={["admin_id", "profile_image", "first_name", "last_name", "email", "gender", "action"]}
        form={(admin) => {
          const a = admin as Admin;
          return(
            <div className="flex items-center">
            <EditMember admin={admin as Admin} />
            <Link href={`/admin/user/components/admin/admindetail/${a.admin_id}`}>
            {view}
            </Link>
            <DeleteMember user_id={a.auth_id}/>
            </div>
          )
        }
        }
      />
    </div>
  );
}
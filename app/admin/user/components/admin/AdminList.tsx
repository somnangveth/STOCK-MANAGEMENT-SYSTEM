"use client";
import { Admin } from "@/type/membertype";
import { useEffect, useState } from "react";
import { fetchAdmins } from "../../actions";
import MemberTable from "@/app/components/Tables/memberTable";
import EditMember from "./EditMember";
import Link from "next/link";
import { view } from "@/app/components/ui";
import DeleteMember from "./DeleteMember";

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdmin = async () => {
    try {
      setLoading(true);
      const data = await fetchAdmins();
      console.log("Fetch Admin data: ", data);
      setAdmins(data);
    } catch (error: any) {
      console.error("Failed to fetch Admin Data", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  // Callback to refresh list after deletion
  const handleMemberDeleted = (deletedAuthId: string) => {
    setAdmins(prev => prev.filter(admin => admin.auth_id !== deletedAuthId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <MemberTable
        itemsPerPage={5}
        members={admins}
        columns={["admin_id", "profile_image", "first_name", "last_name", "email", "gender", "action"]}
        form={(admin) => {
          const a = admin as Admin;
          return (
            <div className="flex items-center gap-2">
              <EditMember admin={admin as Admin} />
              <Link href={`/admin/user/components/admin/admindetail/${a.admin_id}`}>
                {view}
              </Link>
              <DeleteMember 
                userId={a.auth_id} 
                onDeleted={() => handleMemberDeleted(a.auth_id)}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
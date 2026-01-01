"use client";
import { Staff } from "@/type/membertype";
import { useEffect, useState } from "react";
import { fetchStaffs } from "../../actions";
import MemberTable from "@/app/components/Tables/memberTable";
import EditStaff from "./EditStaff";
import Link from "next/link";
import { view } from "@/app/components/ui";

export default function StaffList() {
  const [staffs, setStaffs] = useState<Staff[]>([]);

  useEffect(() => {
    async function loadStaffs() {
      try {
        const data = await fetchStaffs();
        setStaffs(data);
      } catch (error: any) {
        throw new Error("Failed to fetch Admin Data", error.message);
      }
    }
    loadStaffs();
  }, []);

  return (
    <div className="overflow-x-auto">
      <MemberTable
      itemsPerPage={5}
        members={staffs}
        columns={["admin_id", "profile_image", "first_name", "last_name", "email", "gender", "action"]}
        form={(staff) => {
          const s = staff as Staff
          return (
            <div className="flex items-center">
              <EditStaff staff={staff as Staff}/>
              <Link href={`/admin/user/components/staff/staffdetail/${s.staff_id}`}>
              {view}
              </Link>
            </div>
          )
        }
        }
      />
    </div>
  );
}
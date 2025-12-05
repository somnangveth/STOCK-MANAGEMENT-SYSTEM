"use client";
import { Staff } from "@/type/membertype";
import { useEffect, useState } from "react";
import { fetchAdmins, fetchStaffs } from "../../actions";
import MemberTable from "@/app/components/Tables/memberTable";
import EditStaff from "./EditStaff";

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
        members={staffs}
        columns={["admin_id", "profile_image", "first_name", "last_name", "email", "gender", "action"]}
        form={(staff) => <EditStaff staff={staff as Staff}/>}
      />
    </div>
  );
}
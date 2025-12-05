"use client";
import { Admin, Staff } from "@/type/membertype";
import FilterMember from "./components/filter/FilterMember";

export default function UserManagenentPage({admin, staff}: {admin: Admin, staff: Staff}) {

  return (
    <div className="space-y-6">
      <FilterMember admin={admin} staff={staff}/>
    </div>
  );
}

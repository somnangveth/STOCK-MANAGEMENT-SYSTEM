"use client";
import { Admin, Staff } from "@/type/membertype";
import FilterMember from "./components/filter/FilterMember";
import { useState } from "react";
import { PermissionPanel } from "./components/permission/PermissionPanel";

export default function UserManagenentPage({admin, staff}: {admin: Admin, staff: Staff}) {
const [ activeTabs, setActiveTabs ] = useState<'users' | 'permission'>('users');

  return (
    <div className="space-y-6">

      <div className="gap-3 border-b ">
        {/* User List Button */}
        <button
        onClick={() => {setActiveTabs('users')}}
        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTabs === "users"
                  ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
          Users List
        </button>

        {/* Permission Panel Button */}
        <button
        onClick={() => {setActiveTabs('permission')}}
        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTabs === "permission"
                  ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
          Permission Setting
        </button>
      </div>
      {activeTabs === 'users' && (
        <FilterMember admin={admin} staff={staff}/>
      )}

      {activeTabs === 'permission' && (
        <>
        <PermissionPanel/>
        </>
      )}
    </div>
  );
}

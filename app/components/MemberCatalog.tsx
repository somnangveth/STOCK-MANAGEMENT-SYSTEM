"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function MemberCatalog({
  profile_image,
  name,
  email,
  role,
  status,
  id,
  editform,
}: {
  profile_image: string;
  name: string;
  email: string;
  role: string;
  status: string;
  id: string;
  editform: ReactNode;
}) {
  return (
    <div
      className="
        border border-gray-300 rounded-xl bg-white p-5 
        grid grid-cols-[80px_1fr_auto] gap-4 items-center 
        hover:shadow-lg transition-shadow
      "
    >
      {/* Profile Image */}
      <div className="h-20 w-20 overflow-hidden flex items-center justify-center bg-gray-100 rounded-full relative">
        <Image
          src={profile_image || "/assets/default.jpg"}
          alt={name || "Profile image"}
          fill
          className="object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="grid grid-rows-3 gap-1 truncate">
        <h3 className="font-semibold text-indigo-700 truncate">{name}</h3>
        <p className="text-gray-700 truncate">{email}</p>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Role: {role}</span>
          <span
            className={cn(
              "font-medium",
              status === "active" ? "text-green-600" : "text-red-500"
            )}
          >
            Status: {status}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div>{editform}</div>
    </div>
  );
}

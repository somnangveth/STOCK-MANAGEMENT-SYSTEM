"use client";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ReactNode } from "react";

type ColumnKey =
  | "admin_id"
  | "staff_id"
  | "profile_image"
  | "first_name"
  | "last_name"
  | "email"
  | "role"
  | "gender"
  | "action";

type Member = {
  admin_id?: number | string;
  staff_id?: number | string;
  profile_image?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  gender?: string;
};

type MemberTableProps = {
  members: Member[];
  columns: ColumnKey[];
  // Accept either a static node OR a function that receives the current member
  form?: ReactNode | ((member: Member) => ReactNode);
};

export default function MemberTable({ members, columns, form }: MemberTableProps) {
  return (
    <Table className="w-full border border-gray-300 rounded-xl">
      <TableHeader className="bg-gray-100">
        <TableRow>
          {columns.includes("admin_id") && <TableHead>ID</TableHead>}
          {columns.includes("staff_id") && <TableHead>ID</TableHead>}
          {columns.includes("profile_image") && <TableHead>Image</TableHead>}
          {columns.includes("first_name") && <TableHead>Firstname</TableHead>}
          {columns.includes("last_name") && <TableHead>Lastname</TableHead>}
          {columns.includes("email") && <TableHead>Email</TableHead>}
          {columns.includes("role") && <TableHead>Role</TableHead>}
          {columns.includes("gender") && <TableHead>Gender</TableHead>}
          {columns.includes("action") && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {members.map((member, index) => {
          const key = member.admin_id ?? member.staff_id ?? index;

          // Render the correct form for THIS row
          const actionContent =
            typeof form === "function" ? form(member) : form;

          return (
            <TableRow key={key}>
              {columns.includes("admin_id") && <TableCell>{member.admin_id}</TableCell>}
              {columns.includes("staff_id") && <TableCell>{member.staff_id}</TableCell>}
              {columns.includes("profile_image") && (
                <TableCell>
                  {member.profile_image ? (
                    <img
                      src={member.profile_image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <img src="/assets/default.jpg" alt="" className="w-10 h-10 rounded-lg" />
                  )}
                </TableCell>
              )}
              {columns.includes("first_name") && <TableCell>{member.first_name}</TableCell>}
              {columns.includes("last_name") && <TableCell>{member.last_name}</TableCell>}
              {columns.includes("email") && <TableCell>{member.email}</TableCell>}
              {columns.includes("role") && <TableCell>{member.role}</TableCell>}
              {columns.includes("gender") && <TableCell>{member.gender}</TableCell>}

              {columns.includes("action") && <TableCell>{actionContent}</TableCell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
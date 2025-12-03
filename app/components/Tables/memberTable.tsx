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
//Users
  | "admin_id"
  | "staff_id"
  | "profile_image"
  | "first_name"
  | "last_name"
  | "email"
  | "role"
  | "gender"
  | "action"
//Vendors
  | "vendor_id"
  | "vendor_name"
  | "contact_person"
  | "phone_number1"
  | "phone_number2"
  | "vendor_email"
  | "vendor_image"
  | "souce_link"
  | "vendor_type"
  | "address"
  | "city"
  | "country"
  | "payment_terms"
  | "notes";

type Member = {
  //Users
  admin_id?: string;
  staff_id?: string;
  profile_image?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  gender?: string;

  //Vendors
  vendor_id?: string;
  vendor_name?: string;
  contact_person?: string;
  phone_number1?: string;
  phone_number2?: string;
  vendor_email?: string;
  vendor_image?: string;
  source_link?: string;
  vendortype?: string;
  address?: string;
  city?: string;
  country?: string;
  payment_terms?: string;
  note?: string;
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
          {/* Users */}
          {columns.includes("admin_id") && <TableHead>ID</TableHead>}
          {columns.includes("staff_id") && <TableHead>ID</TableHead>}
          {columns.includes("profile_image") && <TableHead>Image</TableHead>}
          {columns.includes("first_name") && <TableHead>Firstname</TableHead>}
          {columns.includes("last_name") && <TableHead>Lastname</TableHead>}
          {columns.includes("email") && <TableHead>Email</TableHead>}
          {columns.includes("role") && <TableHead>Role</TableHead>}
          {columns.includes("gender") && <TableHead>Gender</TableHead>}
          {columns.includes("action") && <TableHead>Action</TableHead>}

          {/* Vendors */}
          {columns.includes("vendor_id") && <TableHead>Vendor ID: </TableHead>}
          {columns.includes("vendor_image") && <TableHead>Logo: </TableHead>}
          {columns.includes("vendor_name") && <TableHead>Vendor Name: </TableHead>}
          {columns.includes("contact_person") && <TableHead>Contact Person</TableHead>}
          {columns.includes("vendor_type") && <TableHead>Vendor Type:</TableHead>}
          {columns.includes("phone_number1") && <TableHead>Phone Number 1: </TableHead>}
          {columns.includes("phone_number2") && <TableHead>Phone Number 2: </TableHead>}
          
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

              {/* Vendors */}
              {columns.includes("vendor_id") && <TableCell>{member.vendor_id}</TableCell>}
              {columns.includes("vendor_image") && <TableCell>
                {member.vendor_image ?
                (<img 
                src={member.vendor_image}
                alt=""
                className="w-10 h-10 rounded-lg object-cover"
                />):(
                  <img 
                src="/assets/default.jpg"
                alt=""
                className="w-10 h-10 rounded-lg"/>
                )}
                </TableCell>}
              {columns.includes("vendor_name") && <TableCell>{member.vendor_name}</TableCell>}
              {columns.includes("contact_person") && <TableCell>{member.contact_person || "_"}</TableCell>}
              {columns.includes("vendor_type") && <TableCell>{member.vendortype}</TableCell>}
              {columns.includes("phone_number1") && <TableCell>{member.phone_number1}</TableCell>}


              {columns.includes("action") && <TableCell>{actionContent}</TableCell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
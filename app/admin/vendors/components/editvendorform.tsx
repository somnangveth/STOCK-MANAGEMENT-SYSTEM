
// app/admin/vendors/components/editvendorform.tsx
'use client';
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import UpdateVendor from "./editvendor"; // Import the actual form component
import { edit } from "@/app/components/Icons";
import { Vendor } from "@/type/membertype";

export default function UpdateForm({ vendor }: { vendor: Vendor }) {
  return (
    <DialogForm
      id="update-trigger"
      title="Edit Vendor"
      Trigger={
        <button
          className="
            flex items-center gap-1
            px-3 py-2
            text-sm font-medium
            text-blue-600
            rounded-lg
            hover:bg-blue-50
            active:bg-blue-100
            transition
          "
        >
          Edit
        </button>
      }
      form={<UpdateVendor vendor={vendor} />}
    />
  );
}

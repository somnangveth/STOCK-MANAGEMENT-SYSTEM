
// app/admin/vendors/components/editvendorform.tsx
'use client';
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import UpdateVendor from "./editvendor"; // Import the actual form component
import { edit } from "@/app/components/ui";
import { Vendors } from "@/type/productType";

export default function UpdateForm({ vendor }: { vendor: Vendors }) {
  return (
    <DialogForm
      id="update-trigger"
      Trigger={
        <button
          className="
            flex items-center gap-1
            px-3 py-2
            text-sm font-medium
            text-blue-600
            rounded-lg
            active:bg-blue-100
            transition
          "
        >
          Edit
        </button>
      }
      form={<UpdateVendor vendors={vendor} />}
    />
  );
}

"use client";
import { ReactNode, useState, useImperativeHandle, forwardRef } from "react";
import AddAssociation from "./AddAssociation";
import { plusCircle } from "@/app/components/Icons";

export interface AddAssociatedFormRef {
  open: () => void;
  close: () => void;
}

const AddAssociatedForm = forwardRef<AddAssociatedFormRef, {
  id: string;
  Trigger?: ReactNode;
  form?: ReactNode;
}>(({ id, Trigger, form }, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  return (
    <div className="">
      {Trigger ? (
        <div onClick={() => setOpen(true)}>{Trigger}</div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          className="flex items-center gap-1 border border-amber-800 bg-yellow-100 text-amber-600 p-2 rounded-lg text-sm"
        >
         {plusCircle} Add Association
        </button>
      )}

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-opacity-30 z-40"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              fixed top-0 right-0 h-full bg-white z-50
              transform translate-x-0
              transition-transform duration-300 ease-in-out
              overflow-y-auto 
              w-full max-w-lg shadow-2xl
            " 
          >
            {form || <AddAssociation onClose={() => setOpen(false)} />}
          </div>
        </>
      )}
    </div>
  );
});

AddAssociatedForm.displayName = "AddAssociatedForm";

export default AddAssociatedForm;
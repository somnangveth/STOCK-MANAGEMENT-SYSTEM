"use client";

import { RxPlusCircled } from "react-icons/rx";
import { btnStyle } from "@/app/components/Icons";
import DialogForm from "@/app/components/DialogForm";
import CreateLedger from "./addform";
import { Vendor } from "@/type/membertype";
import { output, ZodObject, ZodEnum, ZodString, ZodOptional, ZodNumber } from "zod";
import { $strip } from "zod/v4/core";

interface LedgerFormProps {
  vendors?: Vendor[];
  onLedgerAdded?: () => void;
}

export default function LedgerForm({ vendors, onLedgerAdded }: LedgerFormProps) {
  return (
    <DialogForm
      title="Create Ledger"
      Trigger={<button className={btnStyle}>
        <RxPlusCircled /> Add Ledger
      </button>}
      form={<CreateLedger 
        vendors =  {vendors}
        onSuccess={onLedgerAdded} 
        createLedgerEntry={
          function (data: output<ZodObject<{ 
            source_type: ZodEnum<{ purchase: "purchase"; refund: "refund"; }>;  
            vendor_name: ZodString;
            debit: ZodOptional<ZodNumber>; 
            credit: ZodOptional<ZodNumber>; 
            note: ZodOptional<ZodString>; 
            created_at: ZodString;
            over_date: ZodString }, 
            $strip>>): Promise<void> {
        throw new Error("Function not implemented.");
      } } 
      />} id={""}   />
  );
}

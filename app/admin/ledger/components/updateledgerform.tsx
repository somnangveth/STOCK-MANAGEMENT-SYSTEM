//updateledgerform.tsx
'use client';
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Product } from "@/type/productType";
import Updateledger from "./updateledger"; // Import the actual form component
import { edit } from "@/app/components/Icons";
import { Ledger } from "@/type/ledger";

export default function UpdateForm({ledger}: {ledger: Ledger}){
    return(
        <DialogForm
            id="update-trigger"
            title="Update Ledger"
            Trigger={
                <button
                    className="
                        w-10 h-5 text-sm bg-transparent text-blue-500 rounded-xl">
                    {edit}
                </button>
            }
            form = {<Updateledger Ledger={ledger}/>}
        />
    )
}
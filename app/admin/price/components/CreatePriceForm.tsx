"use client";

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import CreatePrice from "./CreatePrice";

export default function CreatePriceForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <DialogForm
      id="create-price"
      title={`Add Price - ${productName}`}
      Trigger={
        <Button className="w-10 h-5 bg-transparent text-blue-500">➕</Button>
      }
      form={
        <CreatePrice
          productId={productId}
          onSuccess={() => {
            // refresh price list if needed
          }}
        />
      }
    />
  );
}

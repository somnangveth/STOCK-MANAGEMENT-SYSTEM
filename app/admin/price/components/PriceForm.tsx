"use client";

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import CreatePrice from "./CreatePrice";
import { RxPlusCircled } from "react-icons/rx";

export default function PriceForm({
  onPriceAdded,
}: {
  onPriceAdded?: () => void;
}) {
  return (
    <DialogForm
      id="price-trigger"
      title="Add Price"
      Trigger={
        <Button
          className="
            border border-blue-700
            bg-blue-100 text-blue-700
            hover:bg-blue-700 hover:text-blue-50
            flex items-center gap-2
          "
        >
          <RxPlusCircled />
          Add Price
        </Button>
      }
      form={<CreatePrice onSuccess={onPriceAdded} />}
    />
  );
}

"use client";

import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Price } from "@/type/productType";
import UpdatePrice from "./updatePrice";
import { edit } from "@/app/components/Icons";

export default function UpdatePriceForm({ price }: { price: Price }) {
  return (
    <DialogForm
      id="update-price-trigger"
      title="Update Price"
      Trigger={
        <Button className="w-10 h-5 text-sm bg-transparent text-blue-500 rounded-xl">
          {edit}
        </Button>
      }
      form={<UpdatePrice price={price} />}
    />
  );
}

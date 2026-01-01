"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import CreateProduct from "./CreateProduct";
import { RxPlusCircled } from "react-icons/rx";
import { btnStyle } from "@/app/components/Icons";

export default function ProductForm({ 
  onProductAdded 
}: { 
  onProductAdded?: () => void 
}) {
  return (
    <DialogForm
      id="product-trigger"
      title="Create Product"
      Trigger={
        <button
          className={btnStyle}
        >
          <RxPlusCircled/> Add Product
        </button>
      }
      form={<CreateProduct onSuccess={onProductAdded} />}
    />
  );
}
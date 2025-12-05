"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import CreateProduct from "./CreateProduct";

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
        <Button
          className="
            border border-blue-700
            bg-blue-100 text-blue-700
            hover:bg-blue-700 hover:text-blue-50"
        >
          + Add Product
        </Button>
      }
      form={<CreateProduct onSuccess={onProductAdded} />}
    />
  );
}
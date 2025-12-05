"use client";

import { useForm } from "react-hook-form";
import { Sale, SaleItem } from "../type";
import { useTransition } from "react";
import { toast } from "sonner";
import { addSaleItemServerSide } from "@/app/functions/sale/sales";
import { Button } from "@/components/ui/button";

interface AddSaleItemFormProps {
  sale: Sale;
  onItemAdded?: (items: SaleItem[]) => void;
}

export default function AddSaleItemForm({ sale, onItemAdded }: AddSaleItemFormProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { product_id: "", quantity: 1, unit_price: 0, total: 0 },
  });

  const quantity = watch("quantity");
  const unit_price = watch("unit_price");

  const onSubmit = (values: any) => {
    startTransition(async () => {
      try {
        const total = (values.quantity || 0) * (values.unit_price || 0);
        const data = await addSaleItemServerSide({
          sale_id: sale.sale_id,
          product_id: values.product_id,
          quantity: values.quantity,
          unit_price: values.unit_price,
          total,
        });
        toast.success("Sale item added!");
        reset({ product_id: "", quantity: 1, unit_price: 0, total: 0 });

        if (onItemAdded) {
          onItemAdded(data.map((i: any) => ({
            product_name: i.product_name || "",
            quantity: i.quantity,
            unit_price: i.unit_price,
            total: i.total,
          })));
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to add sale item");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex gap-4">
        <input {...register("product_id")} placeholder="Product ID" className="flex-1 px-3 py-2 border rounded" />
        <input type="number" {...register("quantity", { valueAsNumber: true })} min={1} className="flex-1 px-3 py-2 border rounded" />
        <input type="number" {...register("unit_price", { valueAsNumber: true })} min={0} className="flex-1 px-3 py-2 border rounded" />
        <input value={(quantity || 0) * (unit_price || 0)} readOnly className="flex-1 px-3 py-2 border rounded bg-gray-100" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Adding..." : "Add Item"}
      </Button>
    </form>
  );
}

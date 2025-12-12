// app/admin/sales/components/addsales.tsx

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useTransition } from "react";
import { addSaleServerSide, addSaleItemServerSide } from "@/app/functions/sale/sales";
import { toast } from "sonner";
import { Sale } from "../type";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface AddSalesFormProps {
  onAddSuccess?: (sale: Sale) => void;
}

const ProductSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total: z.number().min(0),
});

const FormSchema = z.object({
  sales_number: z.string().min(1),
  sale_date: z.string().min(1),
  customer_name: z.string().min(1),
  customer_email: z.string().optional(),
  customer_phone: z.string().min(1),
  subtotal: z.number().min(0),
  tax_amount: z.number().min(0),
  discount_amount: z.number().min(0),
  total_amount: z.number().min(0),
  payment_method: z.enum(["Online", "Cash", "Card", "Bank Transfer"]),
  payment_status: z.enum(["pending", "paid", "partial", "refunded"]),
  process_status: z.enum(["draft", "completed", "cancelled"]),
  note: z.string().optional(),
  items: z.array(ProductSchema).min(1, "至少选择一个产品"),
});

export default function AddSalesForm({ onAddSuccess }: AddSalesFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sales_number: "",
      sale_date: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      subtotal: 0,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 0,
      payment_method: "Online",
      payment_status: "pending",
      process_status: "draft",
      note: "",
      items: [{ product_id: "", quantity: 1, unit_price: 0, total: 0 }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const calculateTotals = () => {
    const subtotal = form.getValues("items").reduce((sum, item) => sum + item.total, 0);
    form.setValue("subtotal", subtotal);
    form.setValue("total_amount", subtotal + form.getValues("tax_amount") - form.getValues("discount_amount"));
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      try {
        // 1️⃣ 创建销售单
        const sale: Sale = await addSaleServerSide({
          ...data,
          subtotal: Number(data.subtotal),
          tax_amount: Number(data.tax_amount),
          discount_amount: Number(data.discount_amount),
          total_amount: Number(data.total_amount),
          sale_items: []
        });

        // 2️⃣ 循环添加销售项
        const itemsWithIds = [];
        for (const item of data.items) {
          const saleItem = await addSaleItemServerSide({
            sale_id: sale.sale_id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
          });
          itemsWithIds.push(saleItem);
        }

        // 3️⃣ 合并 sale + items
        sale.items = itemsWithIds;

        toast.success("Sale created successfully");
        form.reset();

        if (onAddSuccess) onAddSuccess(sale);
      } catch (err: any) {
        toast.error(err.message || "Failed to create sale");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded bg-white shadow">
        {/* 客户信息 */}
        <div className="flex gap-4">
          <FormField control={form.control} name="sales_number" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Sales Number</FormLabel>
              <FormControl>
                <input {...field} type="text" className="w-full px-2 py-1 border rounded" />
              </FormControl>
            </FormItem>
          )}/>
          <FormField control={form.control} name="customer_name" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <input {...field} type="text" className="w-full px-2 py-1 border rounded" />
              </FormControl>
            </FormItem>
          )}/>
        </div>

        {/* 产品列表 */}
        <div className="space-y-2">
          {fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="flex gap-2 items-end">
              <FormField control={form.control} name={`items.${index}.product_id` as const} render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <input {...field} type="text" className="w-full px-2 py-1 border rounded" placeholder="Product ID" />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name={`items.${index}.quantity` as const} render={({ field }) => (
                <FormItem>
                  <FormLabel>Qty</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      value={field.value}
                      onChange={e => {
                        const val = Number(e.target.value);
                        field.onChange(val);
                        const unit_price = form.getValues(`items.${index}.unit_price`);
                        update(index, { ...form.getValues(`items.${index}`), total: val * unit_price });
                        calculateTotals();
                      }}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name={`items.${index}.unit_price` as const} render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="number"
                      value={field.value}
                      onChange={e => {
                        const val = Number(e.target.value);
                        field.onChange(val);
                        const quantity = form.getValues(`items.${index}.quantity`);
                        update(index, { ...form.getValues(`items.${index}`), total: quantity * val });
                        calculateTotals();
                      }}
                      className="w-24 px-2 py-1 border rounded"
                    />
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name={`items.${index}.total` as const} render={({ field }) => (
                <FormItem>
                  <FormLabel>Total</FormLabel>
                  <FormControl>
                    <input {...field} type="number" readOnly className="w-24 px-2 py-1 border rounded bg-gray-100" />
                  </FormControl>
                </FormItem>
              )}/>
              <Button type="button" onClick={() => remove(index)} className="h-8">Del</Button>
            </div>
          ))}
          <Button type="button" onClick={() => append({ product_id: "", quantity: 1, unit_price: 0, total: 0 })}>Add Product</Button>
        </div>

        {/* 小计 / 税 / 折扣 / 总计 */}
        <div className="flex gap-2">
          {["subtotal", "tax_amount", "discount_amount", "total_amount"].map(name => (
            <FormField key={name} control={form.control} name={name as any} render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{name.replace("_", " ").toUpperCase()}</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="number"
                    value={field.value}
                    onChange={e => field.onChange(Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                  />
                </FormControl>
              </FormItem>
            )}/>
          ))}
        </div>

        {/* 提交 */}
        <Button type="submit" disabled={isPending} className="w-full mt-2">
          {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

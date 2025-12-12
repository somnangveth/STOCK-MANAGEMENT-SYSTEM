// app/admin/sales/components/AddSaleItemForm.tsx 


"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition, useState } from "react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Sale, SaleItem } from "../type";
import { addSaleItemServerSide, addSaleServerSide } from "@/app/functions/sale/sales"; // 添加销售项函数
import { useRouter } from "next/navigation";
import { z } from "zod";

// Zod 表单校验
const SaleItemSchema = z.object({
  product_id: z.string().min(1, "Please select a product"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit_price: z.number().min(0, "Unit price cannot be less than 0"),
  total: z.number().min(0),
});

export default function CreateSaleWithItems() {
  const [sale, setSale] = useState<Sale | null>(null);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [items, setItems] = useState<SaleItem[]>([]);

  const [isPending, startTransition] = useTransition();

  // 创建销售单表单
  const handleCreateSale = async () => {
    startTransition(async () => {
      try {
        const newSale: Sale = await addSaleServerSide({
          customer_name: " ", // 可以改成动态表单
          sale_date: new Date().toISOString().split("T")[0],
          subtotal: 0,
          tax_amount: 0,
          discount_amount: 0,
          total_amount: 0,
          sale_items: [],
        });
        setSale(newSale);
        setShowSaleForm(false);
        toast.success("Sale created successfully, start adding products");
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to create sale");
      }
    });
  };

  // AddSaleItemForm
  const form = useForm<z.infer<typeof SaleItemSchema>>({
    resolver: zodResolver(SaleItemSchema),
    defaultValues: {
      product_id: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
    },
  });

  // 自动计算 total
  useEffect(() => {
    const subscription = form.watch((values) => {
      const total = (values.quantity || 0) * (values.unit_price || 0);
      if (total !== values.total) form.setValue("total", total);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleAddItem = (values: z.infer<typeof SaleItemSchema>) => {
    if (!sale) return;
    startTransition(async () => {
      try {
        const newItem: SaleItem[] = await addSaleItemServerSide({
          sale_id: sale.sale_id,
          product_id: values.product_id,
          quantity: values.quantity,
          unit_price: values.unit_price,
          total: values.total,
        });
        setItems(prev => [...prev, ...newItem]);
        form.reset({ quantity: 1, unit_price: 0, total: 0, product_id: "" });
        toast.success("Sale item added successfully");
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to add sale item");
      }
    });
  };

  return (
    <div className="space-y-6">
      {!sale && !showSaleForm && (
        <Button className="bg-green-500 text-white" onClick={() => setShowSaleForm(true)}>
          Add New Sale
        </Button>
      )}

      {showSaleForm && !sale && (
        <div className="p-4 border rounded shadow space-y-4">
          <Button onClick={handleCreateSale} disabled={isPending}>
            {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Create Sale"}
          </Button>
        </div>
      )}

      {sale && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sale: {sale.sales_number || sale.sale_id}</h2>

          {/* Add Sale Item Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-3">
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full px-3 py-2 border rounded">
                        <option value="">-- Select product --</option>
                        <option value="1">Product A</option>
                        <option value="2">Product B</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <input type="number" {...field} min={1} className="w-full px-3 py-2 border rounded" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <input type="number" {...field} min={0} className="w-full px-3 py-2 border rounded" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total</FormLabel>
                      <FormControl>
                        <input {...field} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isPending || !form.watch("product_id")} className="w-full">
                {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Add Item"}
              </Button>
            </form>
          </Form>

          {/* 已添加销售项列表 */}
          {items.length > 0 && (
            <div className="overflow-x-auto border rounded p-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Product</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Unit Price</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border p-2">{item.id}</td>
                      <td className="border p-2">{item.quantity}</td>
                      <td className="border p-2">{item.unit_price}</td>
                      <td className="border p-2">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

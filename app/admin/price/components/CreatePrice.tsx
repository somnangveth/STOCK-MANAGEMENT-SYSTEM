"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { calcB2BPrice } from "@/utils/calcB2BPrice";

import { createPrice } from "@/app/functions/price/price";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

/* ---------------- Schema ---------------- */

const CreatePriceSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  base_price: z.number().min(0),
  profit_price: z.number().min(0),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  discount_price: z.number().min(0).optional(),
  total_price: z.number(),
});

type CreatePriceValues = z.infer<typeof CreatePriceSchema>;

/* ---------------- Component ---------------- */

export default function CreatePrice({
  productId,
  onSuccess,
}: {
  productId?: string; // ✅ OPTIONAL
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  /* ---------- FETCH PRODUCTS ---------- */
  const { data: products = [] } = useQuery({
    queryKey: ["product-query"],
    queryFn: async () => {
      const res = await fetch("/api/admin/fetchProducts");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const form = useForm<CreatePriceValues>({
    resolver: zodResolver(CreatePriceSchema),
    defaultValues: {
      product_id: productId ?? "",
      base_price: 0,
      profit_price: 0,
      tax: 0,
      shipping: 0,
      discount_price: 0,
      total_price: 0,
    },
  });

  /* 🔁 Sync productId prop into form */
  useEffect(() => {
    if (productId) {
      form.setValue("product_id", productId);
    }
  }, [productId, form]);

  /* -------- AUTO CALCULATE TOTAL -------- */

  const base = form.watch("base_price");
  const profit = form.watch("profit_price");
  const tax = form.watch("tax");
  const shipping = form.watch("shipping");
  const discount = form.watch("discount_price") ?? 0;

  useEffect(() => {
    const total = base + profit + tax + shipping - discount;
    form.setValue("total_price", Number(total.toFixed(2)));
  }, [base, profit, tax, shipping, discount, form]);

  /* -------- SUBMIT -------- */

  function onSubmit(values: CreatePriceValues) {
    startTransition(async () => {
      try {
        // ✅ Calculate B2B automatically
        const b2b = calcB2BPrice({
          base_price: values.base_price,
          profit_price: values.profit_price,
          discount_price: values.discount_price ?? 0,
        });

        await createPrice({
          product_id: values.product_id,

          // B2C
          base_price: values.base_price,
          profit_price: values.profit_price,
          tax: values.tax,
          shipping: values.shipping,
          discount_price: values.discount_price ?? 0,
          total_price: values.total_price,
          // B2B
          b2b_price: b2b.total_price,
        });

        await queryClient.invalidateQueries({
          queryKey: ["price-query"],
        });

        toast.success("Price created successfully");
        onSuccess?.();
        form.reset();
      } catch (error: any) {
        toast.error("Failed to create price", {
          description: error.message,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* -------- PRODUCT SELECT -------- */}
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!!productId} // 🔒 lock if provided
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p: any) => (
                      <SelectItem
                        key={p.product_id}
                        value={String(p.product_id)}
                      >
                        {p.product_name} ({p.sku_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* -------- PRICE FIELDS -------- */}
        {[
          "base_price",
          "profit_price",
          "tax",
          "shipping",
          "discount_price",
        ].map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof CreatePriceValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name.replace("_", " ").toUpperCase()}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="1"
                      className="pl-7"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        {/* -------- TOTAL -------- */}
        <FormField
          control={form.control}
          name="total_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Price</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-gray-100" />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Create Price"
          )}
        </Button>
      </form>
    </Form>
  );
}

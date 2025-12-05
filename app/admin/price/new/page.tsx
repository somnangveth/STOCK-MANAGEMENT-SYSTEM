"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { btnStyle } from "@/app/components/Icons";
import { addPrice } from "@/app/functions/price/price"; // <-- create this backend function

// ---------------------
// Zod Schema
// ---------------------
const PriceSchema = z.object({
  product_id: z.string().min(1, "Product is required."),
  base_price: z.coerce.number().min(0),
  profit_price: z.coerce.number().min(0),
  tax: z.coerce.number().min(0),
  shipping: z.coerce.number().min(0),
  discount: z.coerce.number().min(0),
  final_price: z.coerce.number().min(0),
});

export default function AddPrice() {
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<
    { product_id: string; sku_code: string; product_name: string }[]
  >([]);

  // ---------------------
  // Form Setup
  // ---------------------
  const form = useForm<z.infer<typeof PriceSchema>>({
    resolver: zodResolver(PriceSchema),
    defaultValues: {
      product_id: "",
      base_price: 0,
      profit_price: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      final_price: 0,
    },
  });

  const values = useWatch({ control: form.control });

  // ---------------------
  // Fetch Products
  // ---------------------
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => setProducts(json.data || []))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  // ---------------------
  // Auto-compute final price
  // ---------------------
  useEffect(() => {
    const base = Number(values.base_price) || 0;
    const profit = Number(values.profit_price) || 0;
    const tax = Number(values.tax) || 0;
    const shippingCost = Number(values.shipping) || 0;
    const discount = Number(values.discount) || 0;

    // Step 1: base + profit
    const subtotal = base + profit;

    // Step 2: add tax
    const taxed = subtotal + subtotal * (tax / 100);

    // Step 3: add shipping
    const withShipping = taxed + shippingCost;

    // Step 4: apply discount
    const discountAmount = withShipping * (discount / 100);
    const finalPrice = Number((withShipping - discountAmount).toFixed(2));

    form.setValue("final_price", finalPrice, { shouldValidate: false });
  }, [
    values.base_price,
    values.profit_price,
    values.tax,
    values.shipping,
    values.discount,
    form,
  ]);

  // ---------------------
  // Submit Handler
  // ---------------------
  function onSubmit(data: z.infer<typeof PriceSchema>) {
    startTransition(async () => {
      try {
        const result = await addPrice(data);

        const parsed = typeof result === "string" ? JSON.parse(result) : result;

        if (parsed?.error) {
          toast.error("Failed to add price", { description: parsed.error });
          return;
        }

        toast.success("Price created successfully!");
        form.reset();
      } catch (error) {
        console.error(error);
        toast.error("Failed to create price");
      }
    });
  }

  // ---------------------
  // UI
  // ---------------------
  return (
    <div className="max-w-xl p-10">
      <h1 className="text-2xl font-semibold mb-4">Add Price</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Product Dropdown */}
          <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded px-2 py-2"
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_name} ({p.sku_code})
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Price Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="base_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profit_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shipping"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Final Price */}
          <FormField
            control={form.control}
            name="final_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Price</FormLabel>
                <FormControl>
                  <Input type="number" readOnly {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isPending ? (
              <AiOutlineLoading3Quarters className={cn("animate-spin")} />
            ) : (
              "Save Price"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}

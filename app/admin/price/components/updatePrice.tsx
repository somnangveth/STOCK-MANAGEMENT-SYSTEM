"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updatePrice } from "@/app/functions/price/price";
import { Price } from "@/type/productType";
import { calcB2BPrice } from "@/utils/calcB2BPrice";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

/* -------------------- Schema -------------------- */

const UpdatePriceSchema = z.object({
  base_price: z.number().min(0),
  profit_price: z.number().min(0),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  discount_price: z.number().min(0),
  total_price: z.number().min(0),
});

type UpdatePriceValues = z.infer<typeof UpdatePriceSchema>;

/* -------------------- Component -------------------- */

export default function UpdatePrice({
  price,
  onSuccess,
}: {
  price: Price;
  onSuccess?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<UpdatePriceValues>({
    resolver: zodResolver(UpdatePriceSchema),
    defaultValues: {
      base_price: price.base_price,
      profit_price: price.profit_price,
      tax: price.tax,
      shipping: price.shipping,
      discount_price: price.discount_price ?? 0,
      total_price: price.total_price,
    },
  });

  const { watch, setValue } = form;

  /* -------------------- AUTO CALC (B2C VIEW) -------------------- */

  const base = watch("base_price");
  const profit = watch("profit_price");
  const tax = watch("tax");
  const shipping = watch("shipping");
  const discount = watch("discount_price");

  useEffect(() => {
    const subtotal =
      Number(base || 0) +
      Number(profit || 0) +
      Number(tax || 0) +
      Number(shipping || 0);

    const total = subtotal - Number(discount || 0);

    setValue("total_price", Number(total.toFixed(2)), {
      shouldValidate: true,
    });
  }, [base, profit, tax, shipping, discount, setValue]);

  /* -------------------- SUBMIT -------------------- */

  function onSubmit(values: UpdatePriceValues) {
    if (!price.price_id) {
      toast.error("Price ID is missing");
      return;
    }

    startTransition(async () => {
      try {
        // ✅ Correct B2B calculation (50% logic)
        const b2b = calcB2BPrice({
          base_price: values.base_price,
          profit_price: values.profit_price,
          tax: values.tax,
          shipping: values.shipping,
          discount_price: values.discount_price,
        });

        await updatePrice(price.price_id, {
          ...values,
          b2b_price: b2b.total_price,
        });

        // ✅ Refresh price list
        await queryClient.invalidateQueries({
          queryKey: ["price-query"],
        });

        toast.success("Price updated successfully");

        // ✅ Close modal automatically
        onSuccess?.();
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to update price", {
          description: error?.message,
        });
      }
    });
  }

  /* -------------------- UI -------------------- */

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {[
          "base_price",
          "profit_price",
          "tax",
          "shipping",
          "discount_price",
        ].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as keyof UpdatePriceValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldName.replace("_", " ").toUpperCase()}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-7"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        {/* -------- TOTAL (READ ONLY) -------- */}
        <FormField
          control={form.control}
          name="total_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    type="number"
                    className="pl-7 bg-gray-100 cursor-not-allowed"
                    {...field}
                    readOnly
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Update Price"
          )}
        </Button>
      </form>
    </Form>
  );
}

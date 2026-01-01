"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { createLedger } from "../action/ledger";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchVendors } from "@/app/functions/admin/api/controller";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Vendors } from "@/type/productType";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ---------------- Schema ----------------
const LedgerFormSchema = z
  .object({
    source_type: z.enum(["purchase", "refund"]),
    vendor_id: z.number().min(1, "Vendor is required"),
    debit: z.number().min(0),
    credit: z.number().min(0),
    note: z.string().optional(),
  })
  .refine((data) => !(data.debit > 0 && data.credit > 0), {
    message: "Debit and Credit cannot both have values",
    path: ["debit"],
  })
  .refine((data) => data.debit > 0 || data.credit > 0, {
    message: "Either Debit or Credit must have a value",
    path: ["credit"],
  });

// ---------------- Component ----------------
export default function CreateLedgerEntry({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();

  // ---- Fetch Vendor data ----
  const { data: vendorData, isLoading, error } = useQuery<Vendors[]>({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });

  // ---- Form setup ----
  const form = useForm<z.infer<typeof LedgerFormSchema>>({
    resolver: zodResolver(LedgerFormSchema),
    defaultValues: {
      source_type: "purchase",
      vendor_id: 0,
      debit: 0,
      credit: 0,
      note: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: z.infer<typeof LedgerFormSchema>) => {
    startTransition(async () => {
      try {
        const result = await createLedger(data);

        if (!result) {
          console.error("Failed to create ledger");
          toast.error("Failed to create ledger!");
          return;
        }

        toast.success("Ledger entry created successfully");

        form.reset({
          source_type: "purchase",
          vendor_id: 0,
          debit: 0,
          credit: 0,
          note: "",
        });

        onSuccess?.();
      } catch (e: any) {
        console.error("Ledger creation error:", e);
        toast.error("Create failed", { description: e?.message || "Unknown error" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading vendors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 border border-red-300 rounded">
        Error loading vendors. Please try again.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Type */}
          <FormField
            control={form.control}
            name="source_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="purchase">Purchase</option>
                    <option value="refund">Refund</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vendor */}
          <FormField
            control={form.control}
            name="vendor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor *</FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorData?.map((vendor: Vendors) => (
                        <SelectItem key={vendor.vendor_id} value={vendor.vendor_id.toString()}>
                          {vendor.vendor_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Debit */}
          <FormField
            control={form.control}
            name="debit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                      if (value > 0) {
                        form.setValue("credit", 0);
                      }
                    }}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Credit */}
          <FormField
            control={form.control}
            name="credit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
                      field.onChange(value);
                      if (value > 0) {
                        form.setValue("debit", 0);
                      }
                    }}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Optional notes..." rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? (
              <>
                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Ledger Entry"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
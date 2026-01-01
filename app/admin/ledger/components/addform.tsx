"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { createLedger, fetchVendors } from "../action/ledger";

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
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Vendor {
  vendor_id: number;
  vendor_name: string;
}

// ---------------- Schema ----------------
const LedgerFormSchema = z
  .object({
    source_type: z.enum(["purchase", "refund"]),
    vendor_name: z.string().min(1, "Vendor is required"),
    debit: z.preprocess(
      (val) => (val === "" || val === undefined ? 0 : Number(val)),
      z.number().min(0)
    ),
    credit: z.preprocess(
      (val) => (val === "" || val === undefined ? 0 : Number(val)),
      z.number().min(0)
    ),
    note: z.string().optional(),
    created_at: z.string(), // 会传完整 ISO 时间
    over_date: z.string(),  // 会传完整 ISO 时间
  })
  .refine((data) => !(data.debit > 0 && data.credit > 0), {
    message: "Debit and Credit cannot both have values",
    path: ["debit"],
  });

// ---------------- Component ----------------
export default function CreateLedgerEntry({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();

  // ---- 获取 Vendor 数据 ----
  const { data: vendors = [], isLoading: isVendorsLoading } = useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: () => fetchVendors(),
  });

  // ---- 表单 ----
  const form = useForm<z.infer<typeof LedgerFormSchema>>({
    resolver: zodResolver(LedgerFormSchema),
    defaultValues: {
      source_type: "purchase",
      vendor_id: "",
      debit: 0,
      credit: 0,
      note: "",
      created_at: new Date().toISOString(),
      over_date: new Date().toISOString(),
    },
    mode: "onTouched",
  });

  const onSubmit = (data: z.infer<typeof LedgerFormSchema>) => {
    startTransition(async () => {
      try {
        // 调用 server action
        await createLedger({
          source_type: data.source_type,
          vendor_id: data.vendor_id,
          debit: data.debit,
          credit: data.credit,
          note: "",
          created_at: data.created_at,
          over_date: data.over_date,
          source_id: "",
          balance: 0,
          created_by: "",
          vendor_name: ""
        });
        toast.success("Ledger entry created");
        form.reset({
          source_type: "purchase",
          vendor_id:"",
          vendor_name: "",
          debit: 0,
          credit: 0,
          note: "",
          created_at: new Date().toISOString(),
          over_date: new Date().toISOString(),
        });
        onSuccess?.();
      } catch (e: any) {
        toast.error("Create failed", { description: e?.message });
      }
    });
  };

  if (isVendorsLoading) return <p>Loading vendors...</p>;

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
                  <select {...field} className="w-full border rounded px-2 py-1">
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
                  <select {...field} className="w-full border rounded px-2 py-1">
                    <option value="">Select vendor</option>
                    {vendors.map((v) => (
                      <option key={v.vendor_id} value={v.vendor_id}>
                        {v.vendor_name}
                      </option>
                    ))}
                  </select>
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
                    {...field}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? 0 : Number(v));
                      if (v !== "") form.setValue("credit", 0);
                    }}
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
                    {...field}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? 0 : Number(v));
                      if (v !== "") form.setValue("debit", 0);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Created Date */}
          <FormField
            control={form.control}
            name="created_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value.slice(0, 10)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Over Date */}
          <FormField
            control={form.control}
            name="over_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Over Date *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value.slice(0, 10)} />
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
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end border-t pt-4">
          <Button type="submit" disabled={isPending}>
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

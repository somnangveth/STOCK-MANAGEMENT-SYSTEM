'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";

/* ================= Schema =================
   ✔ enum 与 DB / server action 对齐
   ✔ debit / credit 只能填一个
========================================== */
const LedgerSchema = z
  .object({
    vendor_id: z.string().min(1, "Vendor is required"),
    source_type: z.enum(["purchase", "refund"]),
    debit: z.number().min(0).optional(),
    credit: z.number().min(0).optional(),
    note: z.string().optional(),
  })
  .refine(
    (data) =>
      (!!data.debit && !data.credit) || (!!data.credit && !data.debit),
    {
      message: "Either debit or credit must be filled",
      path: ["debit"],
    }
  );

/* ================= Component ================= */
interface UpdateLedgerProps {
  ledger: {
    id: string;
    vendor_id: string;
    source_type: "purchase" | "refund";
    debit: number | null;
    credit: number | null;
    note: string | null;
  };
  onSubmitLedger: (data: z.infer<typeof LedgerSchema>) => Promise<void>;
}

export default function UpdateLedger({
  ledger,
  onSubmitLedger,
}: UpdateLedgerProps) {
  const [isPending, startTransition] = useTransition();
  const text = "text-gray-500";

  const form = useForm<z.infer<typeof LedgerSchema>>({
    resolver: zodResolver(LedgerSchema),
    defaultValues: {
      vendor_id: ledger.vendor_id,
      source_type: ledger.source_type,
      debit: ledger.debit ?? undefined,
      credit: ledger.credit ?? undefined,
      note: ledger.note ?? "",
    },
  });

  /* ===== Vendors ===== */
  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const res = await fetch("/api/admin/fetchVendors");
      if (!res.ok) throw new Error("Failed to fetch vendors");
      return res.json();
    },
  });

  function onSubmit(data: z.infer<typeof LedgerSchema>) {
    startTransition(async () => {
      try {
        await onSubmitLedger(data);
        toast.success("Ledger updated successfully");
      } catch (err: any) {
        toast.error("Failed to update ledger", {
          description: err?.message,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Vendor */}
        <FormField
          control={form.control}
          name="vendor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={text}>Vendor *</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((v: any) => (
                      <SelectItem key={v.vendor_id} value={v.vendor_id}>
                        {v.vendor_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Source Type */}
        <FormField
          control={form.control}
          name="source_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={text}>Source Type *</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Amount */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="debit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={text}>Debit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="credit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={text}>Credit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={text}>Note</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Save Ledger"
          )}
        </Button>
      </form>
    </Form>
  );
}

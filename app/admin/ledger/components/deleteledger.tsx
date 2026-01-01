"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { trash } from "@/app/components/ui";
import { DeleteLedger } from "../action/ledger";
import { Ledger } from "@/type/membertype";
import { id } from "date-fns/locale";

interface DeleteLedgerProps {
  ledger: Ledger;
  onSuccess?: () => void;
}

export default function DeleteLedger({
  ledger,
  onSuccess,
}: DeleteLedgerProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        // ✅ server action 直接 throw error，不返回 res
        DeleteLedger(ledger.id);

        toast.success("Ledger entry deleted successfully");
        setOpen(false);
        onSuccess?.();
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to delete ledger entry", {
          description: err?.message,
        });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-50"
        >
          {trash}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-red-700">
            Confirm Deletion
          </AlertDialogTitle>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {ledger.note || "this ledger entry"}
            </span>
            ?
          </p>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-200 border-2 border-red-700 rounded-xl text-red-700"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";
import { fetchSaleItems, fetchSales } from "@/app/functions/admin/api/controller";
import { updateProcessStatus } from "@/app/functions/admin/sale/sale";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useTransition } from "react";
import { styledToast } from "@/app/components/Toast";
import { Sale } from "@/type/productType";
import { SubmitBtn } from "@/app/components/ui";
import { IsLoading, RetryButton } from "@/app/components/error/error";

export default function DraftReceiptPanel() {
  const [isPending, startTransition] = useTransition();
  const process_status = "completed";

  const results = useQueries({
    queries: [
      {
        queryKey: ["saleQuery"],
        queryFn: fetchSales,
      },
      {
        queryKey: ["saleItemQuery"],
        queryFn: fetchSaleItems,
      },
    ],
  });

  const allSaleData: Sale[] | undefined = results[0].data;
  const saleItemData: any[] | undefined = results[1].data;
  const isLoading = results.some((r) => r.isLoading);
  const hasError = results.some((r) => r.error);

  const saleData = useMemo(() => {
    if (!allSaleData) return [];
    return allSaleData.filter((sale) => sale.process_status === "draft" && sale.customertype === "General");
  }, [allSaleData]);

  const saleItemsBySaleId = useMemo(() => {
    if (!saleItemData) return {};
    return saleItemData.reduce((acc: any, item: any) => {
      acc[item.sale_id] = acc[item.sale_id] || [];
      acc[item.sale_id].push(item);
      return acc;
    }, {});
  }, [saleItemData]);

  function onUpdate(saleId: string) {
    startTransition(async () => {
      try {
        const result = await updateProcessStatus(saleId, process_status);

        if (!result) {
          styledToast.error("Failed to update status");
          return;
        }
        styledToast.success("Completed!");
        window.location.reload();
      } catch (error) {
        console.error(error);
        styledToast.error("Something went wrong");
      }
    });
  }

  return (
    <div>
      {isLoading && (
        <IsLoading/>
      )}
      {hasError && (
        <RetryButton/>
      )}
      {!isLoading && !hasError && (
        <div className="flex flex-col gap-2">
      {saleData?.map((sale) => (
        <div
          key={sale.sale_id}
          className="flex justify-between items-center border p-2"
        >
          <div>
            <p>Sale ID: {sale.sale_id}</p>
            <p>Items: {saleItemsBySaleId[sale.sale_id]?.length || 0}</p>
          </div>
          <button
            className={SubmitBtn}
            disabled={isPending}
            onClick={() => onUpdate(sale.sale_id)}
          >
            Drafted
          </button>
        </div>
      ))}
    </div>
      )}
    </div>
  );
}
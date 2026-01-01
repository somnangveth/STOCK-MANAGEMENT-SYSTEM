"use client";

import { IsLoading, RetryButton } from "@/app/components/error/error";
import { CompletedBtn, SubmitBtn } from "@/app/components/ui";
import { fetchSaleItems, fetchSales } from "@/app/functions/admin/api/controller";
import { Sale } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useTransition } from "react";

export default function CompletedReceiptPanel(){
    const [isPending, startTransition] = useTransition();

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
        return allSaleData.filter((sale) => sale.process_status === "completed" && sale.customertype === "General");
      }, [allSaleData]);

    const saleItemsBySaleId = useMemo(() => {
    if (!saleItemData) return {};
    return saleItemData.reduce((acc: any, item: any) => {
      acc[item.sale_id] = acc[item.sale_id] || [];
      acc[item.sale_id].push(item);
      return acc;
    }, {});
    }, [saleItemData]);
    return(
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
                    className={CompletedBtn}
                  >
                    Completed
                  </button>
                </div>
              ))}
            </div>
              )}
            </div>
    )
}
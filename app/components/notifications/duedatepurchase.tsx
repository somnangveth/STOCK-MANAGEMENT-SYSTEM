"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export default function DuedatePanel() {
  async function fetchLedger() {
    const res = await fetch("/api/admin/fetchledger");
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }

  async function getOverdateLedger() {
    const res = await fetch("/api/admin/getOverdateledger");
    if (!res.ok) throw new Error("Failed to fetch ledger over data");
    return res.json();
  }

  const result = useQueries({
    queries: [
      { queryKey: ["ledgerQuery"], queryFn: fetchLedger },
      { queryKey: ["overdateQuery"], queryFn: getOverdateLedger },
    ],
  });

  const createat = result[0].data;
  const overData = result[1].data;
  const isLoading = result[0].isLoading || result[1].isLoading;
  const hasError = result[0].error || result[1].error;

  const overdateledger = useMemo(() => {
    if (!createat || !overData) return [];

    if (!Array.isArray(createat) || !Array.isArray(overData)) return [];

    const Uniqueledger = [
      ...new Set(overData.map((b: any) => b.id)),
    ];

    return createat.filter((p: any) =>
      Uniqueledger.includes(p.id)
    );
  }, [createat, overData]);

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error loading data</div>;

  return (
    <div className="space-y-1 overflow-y-auto">
      {overdateledger.length === 0 ? (
        <div className="text-gray-500 text-sm">No Purchase Late!</div>
      ) : (
        overdateledger.map((ledger: any) => {
          const batches = overData.filter(
            (batch: any) => batch.id === ledger.id
          );

          return (
            <div
              key={ledger.id}
              className="flex gap-2 p-2 border rounded-lg shadow-sm bg-white items-center"
            >
              <h3 className="text-gray-500 text-sm">{ledger.credit}</h3>

              <p className="text-sm text-gray-600">{ledger.debit}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

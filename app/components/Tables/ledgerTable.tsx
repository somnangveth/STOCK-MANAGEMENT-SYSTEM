'use client';

import { useState, useMemo } from "react";

type ColumnKey<T> = keyof T;

export interface ColumnConfig<T> {
  key: ColumnKey<T>;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface LedgerTableProps<T extends { key: string }> {
  ledger: T[];
  columns: ColumnConfig<T>[];
  itemsPerPage?: number;
}

export default function LedgerTable<T extends { key: string }>({
  ledger,
  columns,
  itemsPerPage = 10,
}: LedgerTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(ledger.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return ledger.slice(start, start + itemsPerPage);
  }, [ledger, page, itemsPerPage]);

  return (
    <div className="space-y-4">
      <table className="table-auto w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-2 border text-left text-sm font-semibold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.key} className="hover:bg-gray-50">
              {columns.map((col) => {
                const value = row[col.key];
                return (
                  <td key={String(col.key)} className="px-4 py-2 border text-sm">
                    {col.render ? col.render(value, row) : String(value ?? "-")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 items-center">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-sm">
            {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

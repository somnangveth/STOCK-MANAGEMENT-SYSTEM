"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ total, perPage }: any) {
  const pages = Math.ceil(total / perPage);
  const router = useRouter();
  const params = useSearchParams();
  const current = Number(params.get("page")) || 1;

  return (
    <div className="flex gap-3 mt-6">
      <Button
        disabled={current === 1}
        onClick={() => router.push(`?page=${current - 1}`)}
      >
        Previous
      </Button>

      <span className="px-4 py-2">
        {current} / {pages}
      </span>

      <Button
        disabled={current === pages}
        onClick={() => router.push(`?page=${current + 1}`)}
      >
        Next
      </Button>
    </div>
  );
}

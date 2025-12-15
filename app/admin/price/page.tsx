"use client";

import { useState, useCallback } from "react";
import SearchBar from "@/app/components/SearchBar";
import PriceList, { PriceProduct } from "./components/PriceList";
import PriceForm from "./components/PriceForm";
import { Button } from "@/components/ui/button";

export default function PricePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [role, setRole] = useState<"B2B" | "B2C">("B2C");

  const [prices, setPrices] = useState<PriceProduct[]>([]);
  const [searchConfig, setSearchConfig] = useState<{
    searchKeys: (keyof PriceProduct)[];
    onSearch: (results: PriceProduct[]) => void;
  } | null>(null);

  const registerSearch = useCallback(
    (
      data: PriceProduct[],
      onSearch: (results: PriceProduct[]) => void,
      searchKeys: (keyof PriceProduct)[]
    ) => {
      setPrices(data);
      setSearchConfig({ onSearch, searchKeys });
    },
    []
  );

  const handlePriceAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* ROLE SWITCH */}
      <div className="flex gap-2">
        <Button
          variant={role === "B2C" ? "default" : "outline"}
          onClick={() => setRole("B2C")}
        >
          B2C (Customer)
        </Button>
        <Button
          variant={role === "B2B" ? "default" : "outline"}
          onClick={() => setRole("B2B")}
        >
          B2B (Buyer)
        </Button>
      </div>

      {/* SEARCH */}
      <div className="flex justify-end">
        <div className="w-1/3">
          {searchConfig && (
            <SearchBar
              data={prices}
              onSearch={searchConfig.onSearch}
              searchKeys={searchConfig.searchKeys}
              placeholder="Search prices..."
            />
          )}
        </div>
      </div>

      {/* ADD PRICE */}
      <div className="flex justify-end">
        <PriceForm onPriceAdded={handlePriceAdded} />
      </div>

      {/* PRICE LIST */}
      <PriceList
        refreshKey={refreshKey}
        role={role}
        registerSearch={registerSearch}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import PriceTable from "./components/PriceTable";
import { B2BPriceTable } from "./components/B2BPriceTable";
import B2BPriceManager from "./components/B2BPriceManafer";

export default function PriceManagementPage(){
  const [activeTabs, setActiveTabs] = useState<'b2c' | 'b2b'>('b2c');

  return(
    <div className="flex flex-col">
      <div className="flex">
        <button
      onClick={() => setActiveTabs('b2c')}
      className={`flex-1 px-6 py-3 text-sm font-medium transitio-colors 
      ${
          activeTabs === "b2c"
          ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}>
        B2C
      </button>
      <button
      onClick={() => setActiveTabs('b2b')}
      className={`flex-1 px-6 py-3 text-sm font-medium transitio-colors 
      ${
          activeTabs === "b2b"
          ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}>
        B2B
      </button>
      </div>

      <div className="">
        {activeTabs === 'b2c' && (
        <>H</>
      )}
      {activeTabs === 'b2b' && (
        <B2BPriceManager/>
      )}
      </div>
    </div>
  )
}
"use client";

import { Product } from "@/type/productType";
import { useQuery } from "@tanstack/react-query";

export default function ExpiryStockPanel(){

    return(
        <div className="w-full h-30 border rounded p-3">
            <span className="font-bold text-xl">Expiry Total: </span>
            <h1 className="text-blue-500 text-5xl"></h1>
        </div>
    )
}
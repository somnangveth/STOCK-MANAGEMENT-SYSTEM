"use client";

import { cn } from "@/lib/utils";
import { ProductBatch } from "@/type/productBatch";
import { Product } from "@/type/productType";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ExpiryStockPanel(){

    async function getExpiredBatches(){
        const res = await fetch('/api/admin/getExpiredBatches');
        if(!res.ok){
            console.error("Failed to fetch expired data");
            throw new Error("Failed to fetch");
        }
        return res.json();
    }

    const {data, isLoading, error} = useQuery<ProductBatch[]>({
        queryKey: ["expiredQuery"],
        queryFn: getExpiredBatches,
    });

    if(isLoading){
        return(
            <div className="flex items-center justify-center text-gray-500">
                <p>Loading <AiOutlineLoading3Quarters className={cn("animate-spin")}/></p>
            </div>
        )
    }

    if(error){
        return(
            <div className="flex items-center justify-center text-gray-500">
                <p>Loading <AiOutlineLoading3Quarters className={cn("animate-spin")}/></p>
            </div>
        )
    }

    const getTotalExpiry = () => {
        if(data?.length === 0){
            return 0;
        }else{
            return Number(data?.length)
        }
    }

    return(
        <div className="w-full h-30 border rounded p-3">
            <span className="font-bold text-xl">Expiry Total:</span>
            <h1 className="text-amber-700 text-5xl flex justify-end">{String(getTotalExpiry())}</h1>
        </div>
    )
}
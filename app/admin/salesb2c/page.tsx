"use client";

import { desktop, task } from "@/app/components/ui";
import { useRouter } from "next/navigation";
import SaleTableB2C from "./components/mainpage/SaleTable";
import SaleTotalPanel from "./components/mainpage/TotalSalePanel";

export default function SalePageB2C(){
    const router = useRouter();

    return(
        <div >
            <SaleTotalPanel/>
            <div className="flex gap-2 p-4">
            <button
            onClick={() => router.push('/admin/salesb2c/components/pos')}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-400 text-gray-700">
                {desktop}
            </button>
            <button
            onClick={() => router.push('/admin/salesb2c/components/tracker')}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-400 text-gray-700">
                {task}
            </button>
            </div>

            <SaleTableB2C/>
        </div>
    )
}
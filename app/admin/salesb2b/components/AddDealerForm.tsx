"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AddDealerForm(){
    const router = useRouter();

    return(
        <Button
        onClick={() => router.push('/admin/salesb2b/components/addDealer')}
        className="px-3 py-1 hover:bg-gray-300 ">
            Add Dealer
        </Button>
    )
}
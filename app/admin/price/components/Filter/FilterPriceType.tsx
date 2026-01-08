"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PriceTableB2C from "../B2C/PriceTable";
import PriceTableB2B from "../B2B/PriceTable";

export default function FilterPriceType(){
const [selected, setSelected] = useState('b2c');

return(
    <div className="">
        <div className="flex justify-end p-4">
            
            <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder = "Select member type"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="b2c">B2C</SelectItem>
                <SelectItem value="b2b">B2B</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {selected === 'b2c' ? (
            <div className="mt-5">
                <PriceTableB2C/>
            </div>
        ): (
            <div className="mt-5">
                <PriceTableB2B/>
            </div>
        )}
    </div>
)
}
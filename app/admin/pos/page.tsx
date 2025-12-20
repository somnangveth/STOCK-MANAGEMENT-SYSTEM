"use client";

import { useState } from "react";
import ProductCardList from "./components/ProductCardList";
import ReceiptForm from "./components/ReceiptForm";

export default function POSPage(){
    const [count, setCount] = useState(1);

    return(
        <div>
            <ReceiptForm/>
            <ProductCardList/>
        </div>
    )
}
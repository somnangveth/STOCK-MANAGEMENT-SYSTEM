"use client";

import { useState } from "react";
import ProductCardList from "./components/ProductCardList";

export default function POSPage(){
    const [count, setCount] = useState(1);

    return(
        <div>
            <ProductCardList/>
        </div>
    )
}
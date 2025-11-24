'use client';
import { useEffect, useState } from "react"
import { Stock } from "@/type/productType";
import { fetchStock } from "./actions";

export default function StockPage(){
    const [stock, setStock] = useState<Stock[]>([]);
    const [lowstock, setLowStock] = useState<Stock[]>([]);
    useEffect(()=>{
        async function loadStock(){
            try{
            const data = await fetchStock();
            setStock(data);

            const low = data.filter(item => (item.stock_total ?? 0)<5);
            setLowStock(low);
            }catch(error){
                console.error(error);
            }
        }
        loadStock();
    },[]);


    return(
        <>
        <h1>Stock List</h1>
            {stock.map((item, index) => (
                <div key={index}>
                    {item.stock_name} — {item.stock_total}
                </div>
            ))}

            <h2 style={{marginTop: "30px"}}>Low Stock </h2>
            {lowstock.length === 0 ? (
                <p>All stock levels normal.</p>
            ) : (
                lowstock.map(item => (
                    <div key={item.id} style={{color: "red"}}>
                        ⚠ {item.stock_name} — {item.stock_total}
                    </div>
                ))
            )}
        </>
    )
}
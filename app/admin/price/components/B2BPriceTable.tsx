"use client";

export async function B2BPriceTable(){
    
    //Fetch Price Data
    async function fetchB2BPrices(){
        const res = await fetch('/api/price/fetchPrice');
        if(!res.ok){
            throw new Error('Failed to fetch prices');
        }
        return res.json();
    }

    async function fetchProducts(){
        const res = await fetch('/api/product/fetchProducts');
        if(!res.ok){
            throw new Error('Failed to fetch products');
        }
        return res.json();
    }
    return(
        <div>

        </div>
    )
}
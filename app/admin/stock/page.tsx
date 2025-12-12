"use client";
import { useCallback, useState } from "react";
import ProductList from "./components/productBatch/ProductList";
import { Product } from "@/type/productType";
import SearchBar from "@/app/components/SearchBar";
import { EnhancedProduct } from "../products/components/ProductLists";
import TotalStockPanel from "@/app/components/chart/totalStock";
import IssuedStockPanel from "@/app/components/chart/issuedStock";
import ExpiryStockPanel from "@/app/components/chart/expiryStock";

export default function StockPage(){
    const [refreshKeys, setRefreshKey] = useState(0);
    const[products, setProducts] = useState<EnhancedProduct[]>([]);
    const[searchConfig, setSearchConfig] = useState<{
        searchKeys: (keyof EnhancedProduct)[],
        onSearch: (results: EnhancedProduct[]) => void;
    } | null>(null);

    const registerSearch = useCallback(
        (
            data: EnhancedProduct[],
            onSearch: (results: EnhancedProduct[]) => void,
            searchKeys: (keyof EnhancedProduct)[]
        )=>{
            setProducts(data);
            setSearchConfig({searchKeys, onSearch});
        }, []
    );

    const handleProductAdded = useCallback(()=>{
        setRefreshKey((prev) => prev + 1);
    }, []);
    return(
        <div className="space-y-6 p-6">
            {searchConfig && (
                <SearchBar
                data={products}
                onSearch={searchConfig.onSearch}
                searchKeys={searchConfig.searchKeys}
                placeholder="Search Products..."/>
            )}

            <div className="grid grid-cols-3 gap-2">
                <TotalStockPanel/>
                <IssuedStockPanel/>
                <ExpiryStockPanel/>
            </div>
            <ProductList refreshKey={refreshKeys} onDataLoaded={registerSearch}/>
        </div>
    )
}
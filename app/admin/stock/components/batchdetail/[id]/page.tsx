"use client";

import Catalog from "@/app/components/catalog/Catalog";
import { fetchBatch, fetchExpiredBatch, fetchProducts } from "@/app/functions/admin/api/controller";
import { cn } from "@/lib/utils";
import { ProductBatch } from "@/type/productBatch";
import { Product } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function BatchDetailPage(){
    const [activeTab, setActiveTab] = useState<'batch'| 'expiry' | 'issued'>('batch');
    const params = useParams();
    const router = useRouter();
    const id = params.id;


    //Styling
    const text = 'text-sm text-gray-500';


    const result = useQueries({
        queries:[
            {
                queryKey: ["producsQuery"],
                queryFn: fetchProducts,
            },
            {
                queryKey: ["batchesQuery"],
                queryFn: fetchBatch,
            },
            {
                queryKey: ["expiredQuery"],
                queryFn: fetchExpiredBatch,
            }
        ]
    });

    const productData = result[0].data;
    const batchData = result[1].data;
    const expiredData = result[2].data
    const isLoading = result[0].isLoading || result[1].isLoading || result[2].isLoading;
    const hasError = result[0].error || result[1].error || result[2].error;

    //Extract Product to its specific ID
    const products = useMemo(() => {
        if(!productData || !id) return null;
        const productArray = productData;
        if(!Array.isArray(productArray)) return null;
        return productArray.find((p: Product) => p.product_id === id);
    }, [productData, id]);

    //Extracts all batches for this specific product
    const batches = useMemo(() => {
        if(!batchData || !products) return [];
        const batchArray = batchData;
        if(!Array.isArray(batchArray)) return [];
        return batchArray.filter((b: ProductBatch) => b.product_id === products.product_id);
    }, [products, batchData]);

    //Extracts all expired batches for this specific product
    const expired = useMemo(() => {
        if(!expiredData || !products) return null;
        const expiredArray = expiredData;
        if(!Array.isArray(expiredArray)) return null;
        return expiredArray.filter((e : ProductBatch) => e.product_id === products.product_id);
    }, [products, expiredData]);


    if(isLoading) {
        return(
            <div className="text-gray-500 flex justify-center items-center h-screen">
                <p className="flex items-center gap-2">Loading <AiOutlineLoading3Quarters className={cn("animate-spin")}/></p>
            </div>
        )
    }

    if(hasError) {
        return(
            <div className="text-gray-500 flex justify-center items-center h-screen">
                <p>Failed to Load.</p>
            </div>
        )
    }

    if(!products) {
        return(
            <div className="text-gray-500 flex justify-center items-center h-screen">
                <p>Product not found.</p>
            </div>
        )
    }

    //Product Batches Panel
    const ProductBatchesPanel = () => (
        <div className="p-5">
        <table className="w-full border-collapse">
        <tbody>
            {batches.map((batch: ProductBatch) => (
                <Catalog
                    style="p-2"
                    hasImage = {true}
                    key={batch.batch_id}
                    product={products} 
                    batch={batch} 
                />
            ))}
        </tbody>
        </table>
        </div>

    );

    //Product Expiry Panel
    const ProductExpiryPanel = () => (
        <div className="p-5">
            <table className="w-full border-collapse">
                <tbody>
                    {expired?.map((expiry: ProductBatch) => (
                        <Catalog
                        style="p-2"
                        hasImage = {true}
                        key={expiry.batch_id}
                        product={products}
                        batch={expiry}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );

    //Product Due Date Panel
    const ProductIssuedPanel = () => (
        <div className="flex items-center justify-center text-gray-500 h-40">
            <p>No Issued Products Found.</p>
        </div>
    )

    return (
        <div className="h-screen overflow-y-auto">
            <div className="border-b p-3 flex items-center gap-2">
                <button onClick={() => router.back()} className="hover:bg-gray-100 p-1 rounded">
                    <ArrowLeft/>
                </button>
                <span className="font-semibold">{products.product_name}</span>
            </div>
            
            <div className="flex border-b mt-10">
                {/* Batch Button */}
                <button
                    onClick={() => setActiveTab('batch')}
                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors 
                    ${
                        activeTab === "batch"
                        ? "text-amber-600 border-b-2 border-amber-600 bg-amber-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-amber-600"
                    }`}>
                    Batches
                </button>

                {/* Expiry Tracking */}
                <button
                    onClick={() => setActiveTab('expiry')}
                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors 
                    ${
                        activeTab === "expiry"
                        ? "text-amber-600 border-b-2 border-amber-600 bg-amber-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-amber-600"
                    }`}>
                    Expiry Tracking
                </button>

                {/* Issued Products */}
                <button
                    onClick={() => setActiveTab('issued')}
                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors 
                    ${
                        activeTab === "issued"
                        ? "text-amber-600 border-b-2 border-amber-600 bg-amber-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-amber-600"
                    }`}>
                    Issued Products
                </button>
            </div>


            <div className="min-h-[200px]">
                {activeTab === "batch" && <ProductBatchesPanel/>}
                {activeTab === "expiry" && <ProductExpiryPanel/>}
                {activeTab === "issued" && <ProductIssuedPanel/>}
            </div>
        </div>
    )
}
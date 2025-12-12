"use client";

import { Categories, Product, Subcategories, Vendors } from "@/type/productType";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export default function ProductDetailCatalog({
    product,
    category,
    subcategory,
    vendor
}: {
    product: Product;
    category: Categories;
    subcategory: Subcategories;
    vendor: Vendors;
}){
    const[activeTab, setActiveTab] = useState<"basic" | "price" | "stock" >("basic");

    //Styling
    const text = 'text-sm text-gray-500';

    const createAt = new Date(product.created_at).toISOString().split('T')[0];
    const BasicInfoPanel = () => (
        <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
            <div>
                <p className={text}>Product Name:</p>
                <p className={text}>{product.product_name}</p>
            </div>
            <div>
                <p className={text}>SKU-Code: </p>
                <p className={text}>{product.sku_code}</p>
            </div>
            <div>
                <p>Category: </p>
                <p>{category.category_name}</p>
            </div>
            <div>
                <p>Subcategory: </p>
                <p>{subcategory.subcategory_name}</p>
            </div>
            <div>
                <p>Imported At: </p>
                <p>{createAt}</p>
            </div>
            <div>
                <p>Base Unit: </p>
                <p>{product.base_unit}</p>
            </div>
            <div>
                <p>Unit Per Package: </p>
                <p>{product.units_per_package}</p>
            </div>
            <div>
                <p>Package Type:</p>
                <p>{product.package_type}</p>
            </div>
            <div>
                <p>Description: </p>
                <p>{product.description}</p>
            </div>
        </div>
        </div>
    );

    const PricePanel = () => (
        <div className="text-gray-500 flex items-center justify-center">
            <p>No Price Info</p>
        </div>
    );

    const StockPanel = () => (
        <div className="text-gray-500 flex items-center justify-center">
            <p>No Stock Info Info</p>
        </div>
    )

return (
    <div>
        <div className="border-b border-gray-600 p-2 flex justify-between">
            <Link href="/admin/products"><ArrowLeftIcon/></Link>
            <p>{product.product_name} 's Info</p>
        </div>
        <div className="flex p-5 border border-gray-500 m-3 rounded-lg">
            {product.product_image ? (
                <img src={product.product_image} alt={product.product_name} className="w-[200px] h-[200px] " />
            ):(
                <img src="/assets/default.jpg" alt="default" className="w-[200px] h-[200px] " />
            )}

            <div className="flex flex-col p-4">
            <h1 className="text-2xl font-bold ">{product.product_name}</h1>
            <p className="text-gray-500 text-sm ">SKU-CODE: {product.sku_code}</p>
            <p className="text-gray-500 text-sm ">Vendor Name: {vendor.vendor_name}</p>
            <p className="text-gray-500 text-sm ">Description: {product.description}</p>
            </div>

        </div>

        <div className="flex flex-col gap-5 border-gray-500 mt-10">
            <div className="border-b border-gray-200">
                <button 
                onClick={() => setActiveTab("basic")}
                className={`flex-1 px-6 py-3 text-sm font-medium transitio-colors 
                    ${
                        activeTab === "basic"
                        ? "text-amber-600 border-b-2 border-amber-600 bg-amber-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-amber-50"
                    }`}
                >
                    Basic Info
                </button>
                <button 
                onClick={() => setActiveTab("price")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "price"
                  ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
                  : "text-gray-600 hover:text-amber-900 hover:bg-amber-50"
              }`}
                >
                    Price Info
                </button>

                <button 
                onClick={() => setActiveTab("stock")}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "stock"
                ? "text-amber-600 border-b-2 border-amber-600 bg-amber-50"
                : "text-gray-600 hover:text-amber-900 hover:bg-amber-50"
                }`}
                >
                Stock Info
                </button>
            </div>

            {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "basic" && <BasicInfoPanel/>}
            {activeTab === "price" && <PricePanel/>}
            {activeTab === "stock" && <StockPanel/>}
          </div>
        </div>
    </div>
    )
}
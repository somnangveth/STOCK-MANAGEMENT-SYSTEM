"use client";

import { Categories, Product, Subcategories } from "@/type/productType";
import { faMinusCircle, faPlusCircle } from "../Icons";
import { ReactNode, useState } from "react";

// Product Card
export function ProductCard({
    product, 
    onAddToCart
}: {
    product: Product, 
    onAddToCart: (product: Product) => void
}) {
    return (
        <button
            onClick={() => onAddToCart(product)} 
            className="flex flex-col space-y-2 border border-gray-500 p-2 bg-amber-100 hover:bg-amber-200 transition rounded-lg"
        >
            {product.product_image ? (
                <img 
                    src={product.product_image} 
                    alt={product.product_name} 
                    className="w-full h-32 object-cover rounded"
                />
            ) : (
                <img 
                    src="/assets/product_default.jpg" 
                    alt="no image" 
                    className="w-full h-32 object-cover rounded"
                />
            )}
            <div className="flex justify-between items-center">
                <p className="truncate max-w-[120px] text-sm">{product.product_name}</p>
                <span className="font-semibold text-green-600">${String(product.total_price)}</span>
            </div>
        </button>
    );
}

// Product Card in Receipt
export function ProductOrderCard({
    product, 
    quantity = 1,
    totalPrice = 0,
    onUpdateQuantity
}: {
    product: Product, 
    quantity?: number,
    totalPrice?: number,
    onUpdateQuantity: (productId: number, newQuantity: number) => void
}) {

    return (
        <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            {product.product_image ? (
                <img 
                    src={product.product_image} 
                    alt={product.product_name} 
                    className="w-16 h-16 object-cover rounded"
                />
            ) : (
                <img 
                    src="/assets/product_default.jpg" 
                    alt="no image" 
                    className="w-16 h-16 object-cover rounded"
                />
            )}
            <div className="flex flex-col flex-1 justify-between">
                <p className="font-medium text-sm">{product.product_name}</p>
                <div className="flex items-center gap-2">
                    <button
                        className="w-6 h-6 flex items-center justify-center rounded-full text-gray-700 transition"
                    >
                        {faMinusCircle}
                    </button>
                    <span className="text-sm font-medium text-center">{quantity}</span>
                    <button
                        className="w-6 h-6 flex items-center justify-center rounded-full text-white transition"
                    >
                        {faPlusCircle}
                    </button>
                </div>
                <p className="font-semibold text-green-600">${totalPrice.toFixed(2)}</p>
            </div>
        </div>
    );
}

//Category Card
export function CategoryCard({category}:{category: Categories}){
    const [selectedCategory, setSelectedCategory] = useState<string | null> (null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

    return(
        <div className="flex items-center justify-center h-15 transition ease-in-out duration-300"
        key={category.category_id}
        onClick={() => <>setSelectedCategory(category.category_id); setSelectedSubcategory(null)</>}>
            {category.category_name}
        </div>
    )
}


//Subcategory Card
export function SubcategoryCard({subcategory}:{subcategory: Subcategories}){
    return(
        <div className="p-2 rounded-full bg-amber-700 text-white hover:bg-amber-900">
            <span>{subcategory.subcategory_name}</span>
        </div>
    )
}
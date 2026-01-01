"use client";

import { IsLoading, RetryButton } from "@/app/components/error/error";
import { ProductCard } from "@/app/components/pos/productCard";
import { fetchCategoryAndSubcategory, fetchPricesB2C, fetchProducts } from "@/app/functions/admin/api/controller";
import { Categories, Product, Subcategories } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import ReceiptPanel from "./ReceiptPanel";
import { Sidebar } from "@/components/ui/sidebar";

type CartItem = {
    product: Product;
    quantity: number;
    totalPrice: number;
}

export default function ProductCardList(){
    //---Hook---
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    

    //Fetch datas
    const result = useQueries({
        queries: [
            {
                queryKey: ["productQuery"],
                queryFn: fetchProducts,
            },
            {
                queryKey: ["Category-Subcategory-Query"],
                queryFn: fetchCategoryAndSubcategory,
            },
            {
                queryKey: ["priceB2CQuery"],
                queryFn: fetchPricesB2C,
            }
        ]
    });

    const productQueryResult = result[0].data;
    const categorysubcategoryData = result[1].data;
    const priceQueryResult = result[2].data;
    const isLoading = result[0].isLoading || result[1].isLoading || result[2].isLoading;
    const hasError = result[0].error || result[1].error || result[2].error;

    //Extract product data
    const productData = useMemo(() => {
        if(!productQueryResult) return [];
        return productQueryResult.product || productQueryResult;
    }, [productQueryResult]);

    //Extract price data
    const priceData = useMemo(() => {
        if(!priceQueryResult) return [];
        return Array.isArray(priceQueryResult) ? 
        priceQueryResult : (priceQueryResult.prices || []);
    }, [priceQueryResult]);

    //Merge products with their prices
    const productsWithPrices = useMemo(() => {
        if(!productData || !priceData) return productData || [];

        return productData.map((product: Product) => {
            const price = priceData.find((p: any) => p.product_id === product.product_id);
            if(price){
                return{
                    ...product,
                    base_price: price.base_price,
                    total_price: price.total_price,
                    tax: price.tax,
                    discount_price: price.discount_price,
                    b2b_price: price.b2b_price,
                    shipping: price.shipping,
                    profit_price: price.profit_price,
                };
            }
            return product;
        });
    }, [productData, priceData]);

    //Extract categories from the data
    const categories = useMemo(() => {
        if(!categorysubcategoryData) return[];
        return(categorysubcategoryData.categories || categorysubcategoryData);
    }, [categorysubcategoryData]);

    //Extract subcategories based on selected category
    const subcategories = useMemo(() => {
        if(!selectedCategory || !categorysubcategoryData){
            return[];
        }

        const allSubcategories = categorysubcategoryData.subcategories || [];

        const selectedCat = categories.find((cat: Categories) => 
        String(cat.category_id) === selectedCategory);

        if(!selectedCat){
            return [];
        }

        const filtered = allSubcategories.filter((sub: Subcategories) => {
            return sub.category_id === selectedCat.category_id;
        });

        return filtered;
    }, [selectedCategory, categories, categorysubcategoryData]);

    //Filter products based on selected category and subcategory
    const filteredProducts = useMemo(() => {
        if(!productsWithPrices || !Array.isArray(productsWithPrices)) return [];
        
        let filtered = productsWithPrices;

        if(selectedCategory){
            filtered = filtered.filter((product: Product) => 
            product.category_id === Number(selectedCategory)
        || String(product.category_id) === selectedCategory);
        }

        if(selectedSubcategory){
            filtered = filtered.filter((product: Product) =>
            product.subcategory_id === Number(selectedSubcategory)
        || String(product.subcategory_id) === selectedSubcategory);
        }

        return filtered;
    }, [productsWithPrices, selectedCategory, selectedSubcategory]);

    //Add product to cart
    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => String(item.product.product_id) === String(product.product_id)
            );

            const priceToUse = product.total_price; 

            if(existingItemIndex > -1){
              //Product exists, increase the quantity
              const updatedCart = [...prevCart];
              updatedCart[existingItemIndex].quantity += 1;
              updatedCart[existingItemIndex].totalPrice = updatedCart[existingItemIndex].quantity * priceToUse;
              return updatedCart;
            }else{
                return [...prevCart, {
                    product,
                    quantity: 1,
                    totalPrice: priceToUse,
                }]
            }
        })
    };

    //Update cart item quantity
    const handleUpdateQuantity = (productId: number | string, newQuantity: number) => {
        if(newQuantity <= 0){
            //Remove item from cart
            setCart(prevCart => 
                prevCart.filter(item => 
                    String(item.product.product_id) !== String(productId)
                )
            );
        }else{
            //Update quantity
            setCart(prevCart => 
                prevCart.map(item => {
                    if(String(item.product.product_id) === String(productId)){
                        // Determine the price based on customer type
                        const priceToUse = item.product.total_price;
                        
                        return {
                            ...item,
                            quantity: newQuantity,
                            totalPrice: newQuantity * priceToUse
                        };
                    }
                    return item;
                })
            );
        }
    }

    //Clear Cart
    const handleClearCart = () => {
        setCart([]);
    }

    //Calculate subtotal
    const cartSubtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.totalPrice, 0);
    }, [cart]);

    //Calculate discount based on cart items
    const cartDiscount = useMemo(() => {
        //Sum up all discount_price from cart items
        return cart.reduce((total, item) => {
            const discountPerItem = Number(item.product.discount_price) || 0;
            return total + (discountPerItem * item.quantity);
        },0);
    }, [cart]);

    //Calculate tax based on cart items
    const cartTax = useMemo(() => {
        //Sum up all tax from cart items
        return cart.reduce((total, item) => {
            const taxPerItem = Number(item.product.tax_amount) || 0;
            return total + (taxPerItem * item.quantity);
        }, 0)
    }, [cart]);

    //Calculate Final Total
    const cartTotal = useMemo(() => {
        return cartSubtotal - cartDiscount + cartTax;
    }, [cartSubtotal, cartDiscount, cartTax]);

return(
    <div className="w-full h-screen flex gap-4 overflow-hidden p-4">
        {/* Products Section - Left Side (2/3 width) */}
        <div className="w-2/3 flex flex-col h-full overflow-hidden">
            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <IsLoading/>
                </div>
            )}

            {/* Error */}
            {hasError && (
                <div className="flex items-center justify-center h-full">
                    <RetryButton/>
                </div>
            )}

            {/* Display */}
            {!isLoading && !hasError && (
                <>
                    {/* Filter Section - Fixed height */}
                    <div className="flex-shrink-0 p-2">
                        {/* Category Filter */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedSubcategory(null);
                                }}
                                className={`flex-shrink-0 min-w-[100px] px-4 py-2 rounded-lg transition
                                ${!selectedCategory
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-transparent border border-gray-500 hover:bg-gray-100'
                                }`}>
                                All
                            </button>
                            {categories.map((cat: Categories) => (
                                <button
                                    key={cat.category_id}
                                    onClick={() => {
                                        setSelectedCategory(String(cat.category_id))
                                        setSelectedSubcategory(null);
                                    }}
                                    className={`flex-shrink-0 min-w-[100px] px-4 py-2 rounded-lg transition whitespace-nowrap ${
                                        selectedCategory === String(cat.category_id)
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-transparent border border-gray-500 hover:bg-gray-100'
                                    }`}>
                                    {cat.category_name}
                                </button>
                            ))}
                        </div>

                        {/* Subcategory Filter - Only shows when there are subcategories */}
                        {subcategories.length > 0 && (
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedSubcategory(null)}
                                    className={`flex-shrink-0 px-4 py-1 rounded-full text-sm transition font-medium
                                    ${!selectedSubcategory 
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-transparent border border-gray-400 text-gray-700 hover:bg-gray-100'
                                    }`}>
                                    All
                                </button>
                                {subcategories.map((sub: Subcategories) => (
                                    <button
                                        key={sub.subcategory_id}
                                        onClick={() => setSelectedSubcategory(String(sub.subcategory_id))}
                                        className={`flex-shrink-0 px-4 py-1 rounded-full text-sm transition font-medium whitespace-nowrap
                                        ${selectedSubcategory === String(sub.subcategory_id)
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-transparent border border-gray-400 text-gray-700 hover:bg-gray-100'
                                        }`}>
                                        {sub.subcategory_name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Grid - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-2 pb-4">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product: Product) => (
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))
                            ):(
                                <div className="col-span-full text-center text-gray-500 py-8">
                                    No products found
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* Receipt Panel - Right Side (1/3 width) - FIXED */}
        <div className="w-1/3 h-full">
                <ReceiptPanel
                    cart={cart}
                    cartTotal={cartTotal}
                    cartSubtotal={cartSubtotal}
                    cartDiscount={cartDiscount}
                    cartTax={cartTax}
                    onUpdateQuantity={handleUpdateQuantity}
                    onClearCart={handleClearCart}
                />
        </div>
    </div>
)
}
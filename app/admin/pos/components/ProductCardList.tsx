"use client";

import { CategoryCard, ProductCard, ProductOrderCard } from "@/app/components/pos/productCard";
import { FormField } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Categories, Product, Subcategories } from "@/type/productType";
import { SelectTrigger } from "@radix-ui/react-select";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Cart item type
type CartItem = {
    product: Product;
    quantity: number;
    totalPrice: number;
};

export default function ProductCardList(){
    // --Hooks--
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);

    //Fetch Product
    async function fetchProduct(){
        const res = await fetch('/api/admin/fetchProducts');
        if(!res.ok){
            console.error("Failed to fetch product");
            throw new Error("Error fetching");
        }
        return res.json();
    }

    //Fetch Category and subcategory
    async function fetchCategoryAndSubcategory(){
        const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
        if(!res.ok){
            console.error("Failed to fetch category and subcategory data");
            throw new Error("Error fetching");
        }
        return res.json();
    }

    const result = useQueries({
        queries: [
            {
                queryKey: ["productQuery"],
                queryFn: fetchProduct,
            },
            {
                queryKey: ["Category-Subcategory-Query"],
                queryFn: fetchCategoryAndSubcategory,
            }
        ]
    });

    const productQueryResult = result[0].data;
    const categorysubcategoryData = result[1].data;
    const isLoading = result[0].isLoading || result[1].isLoading;
    const hasError = result[0].error || result[1].error;

    // Extract product data from the response
    const productData = useMemo(() => {
        if (!productQueryResult) return [];
        return productQueryResult.product || productQueryResult;
    }, [productQueryResult]);

    //Extract categories from the data
    const categories = useMemo(() => {
        if(!categorysubcategoryData) return [];
        return categorysubcategoryData.categories || categorysubcategoryData;
    }, [categorysubcategoryData]);

    // Extract subcategories based on selected category
    const subcategories = useMemo(() => {
        if (!selectedCategory || !categorysubcategoryData) return [];
        
        const allSubcategories = categorysubcategoryData.subcategories || [];
        
        const selectedCat = categories.find((cat: Categories) => 
            cat.category_id === selectedCategory || cat.category_id === selectedCategory
        );
        
        if (!selectedCat) return [];
        
        return allSubcategories.filter((sub: Subcategories) => 
            sub.category_id === selectedCat.category_id
        );
    }, [selectedCategory, categories, categorysubcategoryData]);

    //Filter products by category and/or subcategory
    const filteredProducts = useMemo(() => {
        if(!productData || !Array.isArray(productData)) return [];

        let filtered = productData;

        if(selectedCategory){
            filtered = filtered.filter((product: Product) =>
                product.category_id === Number(selectedCategory) || 
                (String(product.category_id)) === selectedCategory
            );
        }

        if(selectedSubcategory){
            filtered = filtered.filter((product: Product) => 
                product.subcategory_id === Number(selectedSubcategory) || 
                (String(product.subcategory_id)) === selectedSubcategory
            );
        }

        return filtered;
    }, [productData, selectedCategory, selectedSubcategory]);

    // Add product to cart
    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => item.product.product_id === product.product_id
            );

            if (existingItemIndex > -1) {
                // Product exists, increase quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += 1;
                updatedCart[existingItemIndex].totalPrice = 
                updatedCart[existingItemIndex].quantity * Number(product.total_price);
                return updatedCart;
            } else {
                // New product, add to cart
                return [...prevCart, {
                    product,
                    quantity: 1,
                    totalPrice: Number(product.total_price)
                }];
            }
        });
    };

    // Update cart item quantity
    const handleUpdateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            setCart(prevCart => prevCart.filter(item => (Number(item.product.product_id)) !== productId));
        } else {
            setCart(prevCart => {
                return prevCart.map(item => {
                    if ((Number(item.product.product_id)) === productId) {
                        return {
                            ...item,
                            quantity: newQuantity,
                            totalPrice: newQuantity * Number(item.product.total_price)
                        };
                    }
                    return item;
                });
            });
        }
    };

    // Calculate total
    const cartTotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.totalPrice, 0);
    }, [cart]);

    //Handle loading state
    if(isLoading){
        return (
            <div className="flex items-center justify-center gap-2 p-8 text-gray-500 text-sm">
                Loading <AiOutlineLoading3Quarters className="animate-spin"/>
            </div>
        );
    }

    if(hasError){
        return <div className="p-4 text-red-600">Error loading data. Please try again</div>
    }

    return (
        <div className="w-full flex gap-4">
            {/* Product List */}
            <div className="w-2/3 p-2">
                {/* Category and Subcategory Panel */}
                <div className="mb-4">
                    {/* Category */}
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        <button 
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedSubcategory(null);
                            }}
                            className={`px-4 py-2 rounded-lg transition ${
                                !selectedCategory 
                                    ? 'bg-amber-600 text-white' 
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((cat: Categories) => (
                            <button
                                key={cat.category_id}
                                onClick={() => {
                                    setSelectedCategory(String(cat.category_id));
                                    setSelectedSubcategory(null);
                                }}
                                className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                                    selectedCategory === String(cat.category_id)
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {cat.category_name}
                            </button>
                        ))}
                    </div>
                    
                    {/* Subcategory */}
                    {subcategories.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedSubcategory(null)}
                                className={`px-3 py-1 rounded-full text-sm transition ${
                                    !selectedSubcategory
                                        ? 'bg-amber-700 text-white'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            >
                                All
                            </button>
                            {subcategories.map((sub: Subcategories) => (
                                <button
                                    key={sub.subcategory_id}
                                    onClick={() => setSelectedSubcategory(String(sub.subcategory_id))}
                                    className={`px-3 py-1 rounded-full text-sm transition ${
                                        selectedSubcategory === String(sub.subcategory_id)
                                            ? 'bg-amber-700 text-white'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                >
                                    {sub.subcategory_name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-250px)]">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product: Product) => (
                            <ProductCard 
                                key={product.product_id} 
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                            No products found
                        </div>
                    )}
                </div>
            </div>

            {/* Receipt Panel */}
            <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Order</h2>
                
                {/* Cart Items */}
                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto mb-4">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <ProductOrderCard
                                key={item.product.product_id}
                                product={item.product}
                                quantity={item.quantity}
                                totalPrice={item.totalPrice}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            No items in cart
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
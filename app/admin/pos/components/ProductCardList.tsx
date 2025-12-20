"use client";

import { ProductCard } from "@/app/components/pos/productCard";
import { Categories, Product, Subcategories } from "@/type/productType";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ReceiptPanel from "./ReceiptPanel";

type CartItem = {
    product: Product;
    quantity: number;
    totalPrice: number;
}

export default function ProductCardList() {
    // -- Hooks --
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerType, setCustomerType] = useState<"General" | "Dealer">("General");

    //Fetch Product
    async function fetchProduct() {
        const res = await fetch('/api/admin/fetchProducts');
        if (!res.ok) {
            console.error("Failed to fetch product datas");
            throw new Error("Error fetching");
        }
        return res.json();
    }

    //Fetch Price
    async function fetchPrice(){
        const res = await fetch('/api/admin/fetchPrices');
        if(!res.ok){
            console.error("Failed to fetch price");
            throw new Error("Error fetching");
        }
        return res.json();
    }

    //Fetch Category and Subcategory
    async function fetchCategoryAndSubcategory() {
        const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
        if (!res.ok) {
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
            },
            {
                queryKey: ["priceQuery"],
                queryFn: fetchPrice,
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
        if (!productQueryResult) return [];
        return productQueryResult.product || productQueryResult;
    }, [productQueryResult]);

    //Extract price data
    const priceData = useMemo(() => {
        if (!priceQueryResult) return [];
        return Array.isArray(priceQueryResult) ? priceQueryResult : (priceQueryResult.prices || []);
    }, [priceQueryResult]);

    // Merge products with their prices
    const productsWithPrices = useMemo(() => {
        if (!productData || !priceData) return productData || [];
        
        return productData.map((product: Product) => {
            const price = priceData.find((p: any) => p.product_id === product.product_id);
            if (price) {
                return {
                    ...product,
                    // Override with price data
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
        if (!categorysubcategoryData) return [];
        return (categorysubcategoryData.categories || categorysubcategoryData);
    }, [categorysubcategoryData]);

    //Extract subcategories based on selected category
    const subcategories = useMemo(() => {
        if (!selectedCategory || !categorysubcategoryData) {
            return [];
        }

        const allSubcategories = categorysubcategoryData.subcategories || [];

        const selectedCat = categories.find((cat: Categories) =>
            String(cat.category_id) === selectedCategory
        );

        if (!selectedCat) {
            return [];
        }

        const filtered = allSubcategories.filter((sub: Subcategories) => {
            return sub.category_id === selectedCat.category_id;
        });

        return filtered;
    }, [selectedCategory, categories, categorysubcategoryData]);

    // Filter products based on selected category and subcategory
    const filteredProducts = useMemo(() => {
        if (!productsWithPrices || !Array.isArray(productsWithPrices)) return [];

        let filtered = productsWithPrices;

        if (selectedCategory) {
            filtered = filtered.filter((product: Product) =>
                product.category_id === Number(selectedCategory) ||
                String(product.category_id) === selectedCategory
            );
        }

        if (selectedSubcategory) {
            filtered = filtered.filter((product: Product) =>
                product.subcategory_id === Number(selectedSubcategory) ||
                String(product.subcategory_id) === selectedSubcategory
            );
        }

        return filtered;
    }, [productsWithPrices, selectedCategory, selectedSubcategory]);

    //Add product to cart
    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => String(item.product.product_id) === String(product.product_id)
            );

            // Determine the price based on customer type
            const priceToUse = customerType === "Dealer" && product.b2b_price 
                ? Number(product.b2b_price) 
                : Number(product.total_price);

            if (existingItemIndex > -1) {
                //Product exists, increase the quantity
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += 1;
                updatedCart[existingItemIndex].totalPrice =
                    updatedCart[existingItemIndex].quantity * priceToUse;
                return updatedCart;
            } else {
                //New product, add to cart
                return [...prevCart, {
                    product,
                    quantity: 1,
                    totalPrice: priceToUse
                }]
            }
        })
    };

    //Update cart item quantity
    const handleUpdateQuantity = (productId: number | string, newQuantity: number) => {
        if(newQuantity <= 0){
            // Remove item from cart
            setCart(prevCart => 
                prevCart.filter(item => 
                    String(item.product.product_id) !== String(productId)
                )
            );
        } else {
            // Update quantity
            setCart(prevCart => 
                prevCart.map(item => {
                    if(String(item.product.product_id) === String(productId)){
                        // Determine the price based on customer type
                        const priceToUse = customerType === "Dealer" && item.product.b2b_price 
                            ? Number(item.product.b2b_price) 
                            : Number(item.product.total_price);
                        
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

    //Clear cart
    const handleClearCart = () => {
        setCart([]);
    }

    //Calculate subtotal
    const cartSubtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.totalPrice, 0);
    }, [cart]);

    //Calculate discount based on cart items
    const cartDiscount = useMemo(() => {
        // Sum up all discount_price from cart items
        return cart.reduce((total, item) => {
            const discountPerItem = Number(item.product.discount_price) || 0;
            return total + (discountPerItem * item.quantity);
        }, 0);
    }, [cart]);

    //Calculate tax based on cart items
    const cartTax = useMemo(() => {
        // Sum up all tax from cart items
        return cart.reduce((total, item) => {
            const taxPerItem = Number(item.product.tax) || 0;
            return total + (taxPerItem * item.quantity);
        }, 0);
    }, [cart]);

    //Calculate Final Total
    const cartTotal = useMemo(() => {
        return cartSubtotal - cartDiscount + cartTax;
    }, [cartSubtotal, cartDiscount, cartTax]);

    //Handle loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 p-8 text-gray-500 text-sm">
                Loading <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
        );
    }

    if (hasError) {
        return <div className="p-4 text-red-600">Error loading data. Please try again</div>
    }

    return (
        <div className="w-full flex gap-4">
            <div className="w-2/3 p-2">
                {/* Category and Subcategory Panel */}
                <div className="mb-4v w-full">
                    <div className="flex gap-2 mb-4 overflow-x-auto h-25">
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setSelectedSubcategory(null);
                            }}
                            className={`w-1/4 px-4 py-2 rounded-lg transition ${!selectedCategory
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
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
                                className={`w-1/4 px-4 py-2 rounded-lg transition whitespace-nowrap ${selectedCategory === String(cat.category_id)
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}>
                                {cat.category_name}
                            </button>
                        ))}
                    </div>
                    
                    <div className="h-12 flex items-center">
                        {subcategories.length > 0 ? (
                            <div className="flex gap-2 overflow-x-auto whitespace-nowrap w-full">
                                <button
                                    onClick={() => setSelectedSubcategory(null)}
                                    className={`px-4 py-1 rounded-full text-sm transition font-medium ${
                                        !selectedSubcategory
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    All
                                </button>

                                {subcategories.map((sub: Subcategories) => (
                                    <button
                                        key={sub.subcategory_id}
                                        onClick={() => setSelectedSubcategory(String(sub.subcategory_id))}
                                        className={`px-4 py-1 rounded-full text-sm transition font-medium ${
                                            selectedSubcategory === String(sub.subcategory_id)
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        {sub.subcategory_name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 italic">
                                {selectedCategory ? 'No subcategories' : 'Select a category'}
                            </div>
                        )}
                    </div>
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
                        <div className="col-span-4 text-center text-gray-500 py-8">
                            No products found
                        </div>
                    )}
                </div>
            </div>

            {/* Receipt Panel */}
            <div className="w-1/3">
                <ReceiptPanel
                    cart={cart}
                    cartTotal={cartTotal}
                    cartSubtotal={cartSubtotal}
                    cartDiscount={cartDiscount}
                    cartTax={cartTax}
                    customerType={customerType}
                    onCustomerTypeChange={setCustomerType}
                    onUpdateQuantity={handleUpdateQuantity}
                    onClearCart={handleClearCart}
                />
            </div>
        </div>
    )
}
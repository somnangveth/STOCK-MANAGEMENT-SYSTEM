"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/type/productType";
import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductOrderCard } from "@/app/components/pos/productCard";
import { trash } from "@/app/components/Icons";
import { addSales } from "@/app/functions/admin/sale/sale";
import { styledToast } from "@/app/components/Toast";

type CartItem = {
    product: Product;
    quantity: number;
    totalPrice: number;
}

//Styling
const text = "text-sm text-gray-500";

// Fixed Zod schema - proper array object definition
const FormSchema = z.object({
    customer_name: z.string().min(1, "Customer name is required"),
    customertype: z.enum(["General", "Dealer"]),
    contact_info: z.string().min(1, "Contact Info is required"),
    payment_method: z.enum(["cash", "card", "bank-transfer"]),
    payment_status: z.enum(["pending", "paid", "partial", "refunded"]),
    note: z.string(),
    discount: z.number().min(0),
    tax: z.number().min(0),
    subtotal: z.number().min(0),
    total: z.number().min(0),
    cart_items: z.array(z.object({
        product_id: z.string(),
        quantity: z.number(),
        unit_price: z.number(),
        subtotal: z.number()
    }))
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function ReceiptPanel({
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    cartTax,
    customerType,
    onCustomerTypeChange,
    onUpdateQuantity,
    onClearCart,
}:{
    cart: CartItem[],
    cartTotal: number,
    cartSubtotal: number,
    cartDiscount?: number,
    cartTax?: number,
    customerType: "General" | "Dealer",
    onCustomerTypeChange: (type: "General" | "Dealer") => void,
    onUpdateQuantity: (productId: string | number, newQuantity: number) => void,
    onClearCart: () => void,
}){
    const [isPending, startTransition] = useTransition();
    const customertypeOptions = ["General", "Dealer"];

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            customer_name: "",
            customertype: customerType,
            contact_info: "",
            payment_method: "cash",
            payment_status: "paid",
            note: "",
            discount: 0,
            tax: 0,
            subtotal: 0,
            total: 0,
            cart_items: []
        }
    });

    // Update form customertype when prop changes
    useEffect(() => {
        form.setValue('customertype', customerType);
    }, [customerType, form]);

    // Update form values when cart changes
    useEffect(() => {
        const cartItems = cart.map(item => ({
            product_id: String(item.product.product_id),
            quantity: parseInt(item.quantity.toString()), // Ensure integer
            unit_price: parseFloat(Number(item.product.total_price).toFixed(2)),
            subtotal: parseFloat(item.totalPrice.toFixed(2)),
        }));

        console.log("=== UPDATING FORM VALUES ===");
        console.log("Cart items:", cartItems);
        console.log("Subtotal:", cartSubtotal);
        console.log("Discount:", cartDiscount);
        console.log("Tax:", cartTax);
        console.log("Total:", cartTotal);

        form.setValue('subtotal', parseFloat(cartSubtotal.toFixed(2)));
        form.setValue('discount', parseFloat((cartDiscount || 0).toFixed(2)));
        form.setValue('tax', parseFloat((cartTax || 0).toFixed(2)));
        form.setValue('total', parseFloat(cartTotal.toFixed(2)));
        form.setValue('cart_items', cartItems);
        
        console.log("Form values after update:", form.getValues());
    }, [cart, cartSubtotal, cartDiscount, cartTax, cartTotal, form]);

    const onSubmit = (data: FormSchemaType) => {
        console.log("=== FORM SUBMIT TRIGGERED ===");
        console.log("Form data:", data);
        console.log("Cart length:", cart.length);
        
        if(cart.length === 0){
            styledToast.error("Cart is empty!");
            return;
        }

        startTransition(async() => {
            try{
                console.log("Sending data to addSales:", data);
                const result = await addSales(data);
                console.log("Result from addSales:", result);

                // Check if result has error
                if(result && 'error' in result && result.error){
                    console.error("Failed to insert:", result.error);
                    styledToast.error("Failed to create receipt!");
                    return;
                }

                // Check if result has success flag
                if(result && 'success' in result && result.success){
                    styledToast.success("Receipt created successfully!");
                    
                    // Clear cart and reset form after successful submission
                    onClearCart();
                    form.reset();
                } else {
                    styledToast.error("Failed to create receipt!");
                }

            }catch(error){
                console.error("Failed to insert receipt data:", error);
                styledToast.error("An error occurred!");
            }
        })
    }
    
    // Add error handler to see validation errors
    const onError = (errors: any) => {
        console.log("=== FORM VALIDATION ERRORS ===");
        console.log("Errors:", errors);
        styledToast.error("Please check all required fields!");
    }

    return(
        <div className="w-full bg-white p-4 rounded-lg shadow-lg">
            <h2 className="font-semibold">Customer Information</h2>

            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-2">

                    {/* Customer Information*/}
                    <div className="flex gap-2">
                    {/* Customer Name */}
                    <FormField
                    control = {form.control}
                    name="customer_name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Customer Name: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Enter customer name"
                                className="border-gray-500"
                                {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    {/* Customer Type */}
                    <FormField
                    control={form.control}
                    name="customertype"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Customer Type: </FormLabel>
                            <FormControl>
                                <Select
                                value={field.value}
                                onValueChange={(value: "General" | "Dealer") => {
                                    field.onChange(value);
                                    onCustomerTypeChange(value);
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customertypeOptions.map((type)=>(
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    </div>

                    {/* Contact Info */}
                    <FormField
                    control={form.control}
                    name="contact_info"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Contact Information: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Phone or email"
                                {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    <div className="flex gap-2">
                        {/* Payment Method */}
                    <FormField
                    control={form.control}
                    name="payment_method"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Payment Method: </FormLabel>
                            <FormControl>
                                <Select
                                value={field.value}
                                onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
                                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>

                    {/* Payment Status */}
                    <FormField
                    control={form.control}
                    name="payment_status"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Payment Status: </FormLabel>
                            <FormControl>
                                <Select
                                value={field.value}
                                onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="partial">Partial</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    </div>

                    {/* Note */}
                    <FormField
                    control={form.control}
                    name="note"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Note: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="(optional)"
                                {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>

                    {/* Product List */}
                    <div className="border-t pt-3 mt-3 h-[350px]">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-700">Order Details</h3>
                            {cart.length > 0 && (
                                <button
                                type="button"
                                onClick={onClearCart}
                                className="text-red-600 hover:text-red-800"
                                title="Clear cart"
                                >{trash}</button>
                            )}
                        </div>
                        <div className="space-y-2 max-h-[280px] overflow-y-auto">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <ProductOrderCard
                                    key={item.product.product_id}
                                    product={item.product}
                                    quantity={item.quantity}
                                    totalPrice={item.totalPrice}
                                    onUpdateQuantity={onUpdateQuantity}
                                    />
                                ))
                            ):(
                                <div className="text-center text-gray-400 py-8">
                                    No items in cart
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-3 mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                        </div>
                        {cartDiscount && cartDiscount > 0 ? (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount:</span>
                                <span className="font-medium text-red-600">-${cartDiscount.toFixed(2)}</span>
                            </div>
                        ) : null}
                        {cartTax && cartTax > 0 ? (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax:</span>
                                <span className="font-medium">${cartTax.toFixed(2)}</span>
                            </div>
                        ) : null}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                    type="submit"
                    disabled = {isPending || cart.length === 0}
                    className="py-2 bg-amber-700 text-white w-full rounded-lg hover:bg-amber-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                        {isPending ? "Saving..." : "Save Receipt"}
                    </button>
                </form>
            </Form>
        </div>
    )
}
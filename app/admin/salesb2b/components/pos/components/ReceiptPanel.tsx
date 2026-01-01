"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { addSalesB2B } from "@/app/functions/admin/sale/sale";
import { useQueries, useQuery } from "@tanstack/react-query";
import { fetchDealers } from "@/app/functions/admin/api/controller";
import { styledToast } from "@/app/components/Toast";
import { Product } from "@/type/productType";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dealer } from "@/type/membertype";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { trash } from "@/app/components/ui";
import { ProductOrderCard } from "@/app/components/pos/productCard";


type CartItem = {
    product: Product;
    quantity: number;
    totalPrice:  number;
}
const FormSchema = z.object({
    dealer_id: z.string().min(1, "Dealer is Required"),
    customertype: z.literal("Dealer"),
    payment_method: z.enum(["cash" , "card" , "bank-transfer"]),
    payment_status: z.enum(["pending" , "paid" , "partial" , "refunded"]),
    note: z.string().optional(),
    delivery_date: z.date(),
    payment_duedate: z.date(),
    discount: z.number().optional(),
    tax: z.number().optional(),
    subtotal: z.number().min(1, "Subtotal is required"),
    total: z.number().min(1, "Total is required"),
    cart_items: z.array(z.object({
        product_id: z.string(),
        quantity: z.number(),
        unit_price: z.number(),
        subtotal: z.number(),
    }))
});

export default function ReceiptPanelB2B({
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    cartTax,
    onUpdateQuantity,
    onClearCart,
}:{
    cart: CartItem[],
    cartTotal: number,
    cartSubtotal: number,
    cartDiscount?: number,
    cartTax: number,
    onUpdateQuantity: (productId: string | number, newQuantity: number) => void,
    onClearCart: () => void,
}){
    const [dealer, setDealer] = useState<Dealer[]>([]);
    const [isPending, startTransition] = useTransition();

    const payment_status = ["pending", "paid", "partial", "refunded"];
    const payment_method = ["cash", "card", "bank-transfer"];

    //Styling
    const text = "text-sm text-gray-500";
    const {data, isLoading, error} = useQuery({
        queryKey: ['dealerQuery'],
        queryFn: fetchDealers,
    });

    //Use useEffect to update dealer state when data changes
    useEffect(() => {
        if(data){
            setDealer(data);
        }
    }, [data]);
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            dealer_id: "",
            customertype: "Dealer",
            payment_method: "cash",
            payment_status: "pending",
            note: "",
            delivery_date: new Date(),
            payment_duedate: new Date(),
            discount: 0,
            tax: 0,
            subtotal: 0,
            total: 0,
            cart_items: [],
        }
    });

    //Update form values when cart changes
    useEffect(() => {
        const cartItems = cart.map(item => ({
            product_id: String(item.product.product_id),
            quantity: parseInt(item.quantity.toString()),
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
        form.setValue('tax', parseFloat((cartTax || 0).toFixed(2)));
        form.setValue('total', parseFloat(cartTotal.toFixed(2)));
        form.setValue('cart_items', cartItems);

        console.log("Form values after update: ", form.getValues());
    }, [cart, cartSubtotal, cartDiscount, cartTax, cartTotal, form])


    function onSubmit(data: z.infer<typeof FormSchema>){
        if(cart.length === 0){
            styledToast.error("Cart is empty");
            return;
        }
        startTransition(async() => {
            try{
                const result = await addSalesB2B(data);

                if(result && 'error' in result && result.error){
                    console.error("Failed to add receipt!");
                    styledToast.error("Failed to save receipt!");
                }

                if(result && 'success' in result && result.success){
                    styledToast.success("Receipt created successfully!");
                    onClearCart();
                    form.reset();
                }else{
                    styledToast.error("Failed to created receipt!");
                }
            }catch(error){
                console.error("Failed to save receipt");
                styledToast.error("An error occured!");
            }
        });
    }

    //Add error handler to see validation errors
    const onError = (errors: any) => {
        console.log("====FORM VALIDATION ERRORS====");
        console.log("Errors: ", errors);
        styledToast.error("Please check all required fields");
    }

    return (
        <div className="w-full bg-white">
            <h1 className="font-semibold mb-4">Dealer Information</h1>

            <div>
                <Form {...form}>
                    <form
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="space-y-2">

                        {/* Select dealer */}
                        <FormField
                        control={form.control}
                        name="dealer_id"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Dealer</FormLabel>
                                <FormControl>
                                    <Select
                                    value={field.value}
                                    onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a dealer"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dealer.map((d) => (
                                                <SelectItem key={d.dealer_id} value={String(d.dealer_id)}>
                                                    {d.business_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}/>

                        <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2">
                            {/* Payment Status */}
                            <FormField
                            control={form.control}
                            name="payment_status"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Payment Status</FormLabel>
                                    <FormControl>
                                        <Select
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {payment_status.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                            />

                            {/* Payment Method */}
                            <FormField
                            control={form.control}
                            name="payment_method"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Payment Method</FormLabel>
                                    <FormControl>
                                        <Select
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {payment_method.map((method) => (
                                                    <SelectItem key={method} value={method}>
                                                        {method}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                            />

                            {/* Delivery Date */}
                            <FormField
                            control={form.control}
                            name="delivery_date"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Delivery Date</FormLabel>
                                    <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            captionLayout="dropdown"
                                            fromYear={2000}
                                            toYear={2030}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* Payment Duedate */}
                            <FormField
                            control={form.control}
                            name="payment_duedate"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Payment Due Date</FormLabel>
                                    <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            captionLayout="dropdown"
                                            fromYear={2000}
                                            toYear={2030}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* Discount */}
                            <FormField
                            control={form.control}
                            name="discount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Discount (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}/>
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* tax */}
                            <FormField
                            control={form.control}
                            name="tax"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Tax (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}/>
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* Note */}
                            <FormField
                            control={form.control}
                            name="note"
                            render={({field}) => (
                                <FormItem className="lg:col-span-2">
                                    <FormLabel className={text}>Note (optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="text"
                                        placeholder="Add a note..."
                                        {...field}/>
                                    </FormControl>
                                </FormItem>
                            )}/>
                        </div>

                        {/* Product List */}
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold text-gray-700">Order Details</h3>
                                {cart.length > 0 && (
                                    <button
                                    type="button"
                                    onClick={onClearCart}
                                    className="text-red-600 hover:text-red-800 transition">
                                        {trash}
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
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
                            ):null}
                            {cartTax && cartTax > 0 ? (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium">${cartTax.toFixed(2)}</span>
                                </div>
                            ):null}
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total:</span>
                                <span className="text-amber-700">${cartTotal.toFixed(2)}</span>
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
        </div>
    )
}
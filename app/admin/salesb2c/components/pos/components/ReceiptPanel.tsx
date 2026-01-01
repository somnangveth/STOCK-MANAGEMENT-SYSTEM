"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/type/productType";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { styledToast } from "@/app/components/Toast";
import { addSalesB2C } from "@/app/functions/admin/sale/sale";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitBtn, trash } from "@/app/components/ui";
import { ProductOrderCard } from "@/app/components/pos/productCard";

type CartItem = {
    product: Product;
    quantity: number;
    totalPrice: number;
}

//Styling
const text = "text-sm text-gray-500";
const line = <div className="flex-1 border-b border-gray-300"></div>;

const FormSchema = z.object({
    payment_method: z.enum(['cash', 'card', 'bank-transfer']),
    discount: z.number().min(0),
    subtotal: z.number().min(0),
    tax: z.number().min(0),
    total: z.number().min(0),
    cart_items: z.array(z.object({
        product_id: z.string(),
        quantity: z.number(),
        unit_price: z.number(),
        subtotal: z.number(),
    }))
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function ReceiptPanel({
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
    cartTax?: number,
    onUpdateQuantity: (productId: string | number, newQuantity: number) => void,
    onClearCart: () => void,
}){
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
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

        form.setValue('subtotal', parseFloat(cartSubtotal.toFixed(2)));
        form.setValue('discount', parseFloat((cartDiscount || 0).toFixed(2)));
        form.setValue('tax', parseFloat((cartTax || 0).toFixed(2)));
        form.setValue('total', parseFloat(cartTotal.toFixed(2)));
        form.setValue('cart_items', cartItems);

        console.log("Form values after update: ", form.getValues());

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
                console.log("Sending data to addSales: ", data);
                const result = await addSalesB2C(data);
                console.log("Result from addSales: ", result);

                //Check if result has error
                if(result && 'error' in result && result.error){
                    console.error("Failed to insert: ", result.error);
                    styledToast.error("Failed to create receipt!");
                    return;
                }

                //Check if result has success flag
                if(result && 'success' in result && result.success){
                    styledToast.success("Receipt created successfully!");
                    onClearCart();
                    form.reset();
                }else{
                    styledToast.error("Failed to create receipt!");
                }
            }catch(error){
                console.error("Failed to insert receipt data", error);
                styledToast.error("An error occured");
            }
        })
    }

    //Add error handleer to see validation errors
    const onError = (errors: any) => {
        console.log("====FORM VALIDATION ERRROS====");
        console.log("Errors: ", errors);
        styledToast.error("Please check all required fields");
    }

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <h1 className="font-semibold">Receipt Information</h1>
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit, onError)}
                className="space-y-2">
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
                                        <SelectItem value="cash">
                                            Cash
                                        </SelectItem>
                                        <SelectItem value="card">
                                            Card
                                        </SelectItem>
                                        <SelectItem value="bank-transfer">
                                            Bank Transfer
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
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
                                className="text-red-600 hover:text-red-800">
                                
                                    {trash}
                                </button>
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
                                    onUpdateQuantity={onUpdateQuantity}/>
                                ))
                            ):(
                                <div className="text-center text-gray-400 py-8">
                                    No items in cart
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t pt-3 mt-3 space-y-3">

                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal: </span>
                            <span>${cartSubtotal.toFixed(2)}</span>
                        </div>

                        {/* Discount */}
                        {cartDiscount && cartDiscount > 0 ? (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount: </span>
                                <span className="font-medium text-red-600">-${cartDiscount.toFixed(2)}</span>
                            </div>
                        ):null}
                        
                        {/* Tax */}
                        {cartTax && cartTax > 0 ? (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax: </span>
                                <span className="font-medium">{cartTax.toFixed(2)}</span>
                            </div>
                        ): null}

                        {/* Total */}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total: </span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                    type="submit"
                    disabled={isPending || cart.length === 0}
                    className={SubmitBtn}>
                        {isPending ? "Saving..." : "Save Receipt"}
                    </button>
                </form>
            </Form>
        </div>
    )
}
"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";

const FormSchema = z.object({
    customer_name: z.string(),
    customer_type: z.enum(["B2B", "B2C"]),
    contact_info: z.string(),
})
export default function ReceiptPanel(){
    const [isPending, startTransition] = useTransition();

    const customer_type = ["B2B", "B2C"];

    //Styling 
    const text = "text-sm text-gray-500"
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            customer_name: "",
            customer_type: "B2C",
            contact_info: "",
        }
    });

    function onSubmit(){
        startTransition(async ()=> {
            
        })
    }
    return(
        <div>
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2">
                    <div>
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
                                {...field}
                                value={field.value}
                                onChange={field.onChange}/>
                            </FormControl>
                        </FormItem>
                    )}/>

                    {/* Customer Type */}
                    <FormField
                    control={form.control}
                    name="customer_type"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Customer Type: </FormLabel>
                            <FormControl>
                                <Select
                                {...field}
                                value={field.value}
                                defaultValue={field.value}
                                onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder=""/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customer_type.map((customer, index) => (
                                            <SelectItem key={index} value={customer}>
                                                {customer}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}/>
                    </div>

                    {/* Contact Info */}
                    <FormField
                    control={form.control}
                    name="contact_info"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Contact Info: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                {...field}
                                placeholder="0xx-xxx-xxx"
                                onChange={field.onChange}/>
                            </FormControl>
                        </FormItem>
                    )}/>


                    {/* Product List */}
                    
                </form>
            </Form>
        </div>
    )
}
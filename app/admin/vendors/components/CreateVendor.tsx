"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createVendors } from "../actions/vendor";
import { deleteImage, uploadImage } from "@/app/components/Image/actions/upload";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import ProfileButton from "@/app/components/Image/components/ProfileButton";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
    vendor_id: z.string(),
    vendor_name: z.string().min(1, {message: "Please Enter Vendor Name"}),
    phone_number1: z.string(),
    phone_number2: z.string().optional(),
    vendor_email: z.string().optional(),
    vendor_location: z.string().optional(),
    vendor_image: z.string().optional(),
    vendortype: z.enum(['local', 'non-local']),
    source_link: z.string().optional(),
})

export default function CreateVendors(){
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const vendortypes = ['local', 'non-local'];

    // Styling
    const text = "text-gray-500";


    const form = useForm<z.infer<typeof FormSchema>> ({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            vendor_id: "",
            vendor_name: "",
            phone_number1: "",
            phone_number2: "",
            vendor_email: "",
            vendor_location: "",
            vendor_image: "local",
            source_link: "",
        }
    })

    // --- Upload Images ---
    async function uploadAllImages(){
        const uploadUrls: string[] = [];

        for (const url of imageUrls){
            const imageFile = await convertBlobUrlToFile(url);
            const {imageUrl, error} = await uploadImage({
                file: imageFile,
                bucket: "images/profiles",
            });

            if(error) throw new Error(error.message);
            uploadUrls.push(imageUrl);
        }
        return uploadUrls;
    }
    // ---Submit function ---
    function onSubmit(data: z.infer<typeof FormSchema>){
        startTransition(async() => {
            try{
                const uploadUrls = await uploadAllImages();
                if(uploadUrls.length > 0){
                    data.vendor_image = uploadUrls[0];
                }

                const result = await createVendors(data);

                const parsed = typeof result === "string" ? JSON.parse(result) : result;
                const { error } = parsed;

                if(error?.message){
                    toast.error("Failed to create member!");
                }else{
                    document.getElementById("vendor-trigger")?.click();
                    toast.success("Vendor created successfully!");

                    form.reset();
                    setImageUrls([]);
                }
            }catch(error: any){
                toast.error("Image upload failed", {
                    description: error.message,
                })
            }
        })
    }

    return(
        <Form {...form}>
            <form 
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}>
                {/* Vendor Profile Image */}
                <ProfileButton imageUrls={imageUrls} setImageUrls={setImageUrls}/>

                {/* Vendor ID and Vendor Name */}
                <div className="flex gap-2">
                    {/* Vendor ID */}
                <FormField
                control={form.control}
                name="vendor_id"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className={text}>Vendor ID: </FormLabel>
                        <FormControl>
                            <Input
                            type="text"
                            {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />   

                {/* Vendor Name */}
                <FormField
                control={form.control}
                name="vendor_name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className={text}>Vendor Name: </FormLabel>
                        <FormControl>
                            <Input
                            type="text"
                            {...field}/>
                        </FormControl>
                    </FormItem>
                )}
                />
                </div>

                {/* Phone Numbers */}
                <div className="flex gap-2">
                    <FormField
                    control={form.control}
                    name="phone_number1"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Phone Number 1: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>

                    <FormField
                    control={form.control}
                    name="phone_number2"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Phone Number 2: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Optional..."
                                {...field}/>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                </div>

                {/* Email and Vendor Type */}
                <div className="flex gap-2">
                    <FormField
                    control={form.control}
                    name="vendor_email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Email: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="vendortype"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Vendor Type:</FormLabel>
                            <FormControl>
                                <Select
                                onValueChange={field.onChange}
                                value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Type"/>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {vendortypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}/>
                </div>

                {/* Source Link */}
                <FormField
                control={form.control}
                name="source_link"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className={text}>Source Link: </FormLabel>
                        <FormControl>
                            <Input
                            type="text"
                            {...field}/>
                        </FormControl>
                    </FormItem>
                )}
                />

                {/* Vendor Location */}
                <FormField
                control={form.control}
                name="vendor_location"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className={text}>Location: </FormLabel>
                        <FormControl>
                            <Input
                            type="text"
                            {...field}/>
                        </FormControl>
                    </FormItem>
                )}
                />

                <Button
                type="submit"
                className="
                border border-blue-700
              bg-blue-100 text-blue-700">
                    {isPending ? (
                        <AiOutlineLoading3Quarters className={cn("animate-spin")}/>
                    ): (
                        "Create Vendor"
                    )}
                </Button>
            </form>
        </Form>
    )
}
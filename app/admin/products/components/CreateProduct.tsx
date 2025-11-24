"use client";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { uploadImage } from "@/app/components/Image/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createProduct } from "../actions/product";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import UploadImageButton from "@/app/components/Image/components/ImageButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
    product_id: z.string(),
    product_name: z.string(),
    product_image: z.string(),
    description: z.string(),
});

export default function CreateProduct(){
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            product_id: "",
            product_name: "",
            product_image: "",
            description: "",
        }
    });

    // -- Style
    const text = 'text-gray-500';

    // --upload Image
    async function uploadAllImages(){
        const uploadUrls: string[] = [];

        for(const url of imageUrls){
            const imageFile = await convertBlobUrlToFile(url);
            const {imageUrl, error} = await uploadImage({
                file: imageFile,
                bucket: "images",
            });

            if(error) throw new Error(error.message);

            uploadUrls.push(imageUrl);
        }
        return uploadUrls;
    }

    async function onSubmit(data: z.infer<typeof FormSchema>){
        startTransition(async() => {
            try{
                const uploadUrls = await uploadAllImages();
                if(uploadUrls.length > 0){
                    data.product_image = uploadUrls[0];
                }
                const result = await createProduct(data);

                const parsed = typeof result === "string" ? JSON.parse(result): result;

                const { error } = parsed;

                if (error?.message) {
                    toast.error("Failed to create member!");
                } else {
                    document.getElementById("product-trigger")?.click(); // ✅ fixed missing ()
                    toast.success("Member created successfully!");
                    form.reset(); 
                    setImageUrls([]);
                }
            }catch(error: any){
                toast.error("Image upload failed", {
                description: error.message,
                });
            }
        })
    }

    return (
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}>

                {/* Product Image */}
                <UploadImageButton imageUrls={imageUrls} setImageUrls={setImageUrls}/>

                {/* Product ID and Name */}
                <div className="flex gap-2">
                    {/*Product ID */}
                    <FormField
                    control={form.control}
                    name="product_id"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Product ID: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                {...field}/>
                            </FormControl>
                        </FormItem>
                    )}/>

                    {/* Product Name */}
                    <FormField
                    control={form.control}
                    name="product_name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={text}>Product Name: </FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                {...field}/>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                </div>

                {/* Description */}
                <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className={text}>Description</FormLabel>

                        <FormControl>
                            <Textarea {...field}/>
                        </FormControl>
                    </FormItem>
                )}/>

                <Button
                type="submit"
                className="
                border border-blue-700
                bg-blue-100 text-blue-700
                hover:bg-blue-700 hover:text-blue-50">
                    {isPending ? (
                        <AiOutlineLoading3Quarters className={cn("animate-spin")}/>
                    ): ("Create Product")}

                </Button>
            </form>
        </Form>
    )
}
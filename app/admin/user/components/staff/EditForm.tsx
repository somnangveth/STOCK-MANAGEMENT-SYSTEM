"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { startTransition, useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { deleteImage, uploadImage } from "@/app/components/Image/actions/upload";
import ProfileButton from "@/app/components/Image/components/ProfileButton";
import { Admin, Staff } from "@/type/membertype";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { updateAdmin, updateStaff } from "../../actions";

const UpdateSchema = z.object({
    staff_id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    profile_image: z.string().optional(),
    password: z.string().optional(),
    status: z.string().optional(),
});

export default function EditForm({staff}: {staff: Staff}){
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof UpdateSchema>>({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            staff_id: staff.staff_id,
            name: staff.name,
            email: staff.email,
            profile_image: staff.profile_image,
            password: staff.password,
            status: staff.status,
        }
    });

    // --- Upload All image ---
    async function uploadAllImages(oldImageUrl: string){
        if(imageUrls.length === 0) return oldImageUrl;

        try{
            if(oldImageUrl){
                await deleteImage({
                    imageUrl: oldImageUrl,
                    bucket: 'images/profiles',
                });
            }
            const url = imageUrls[0];
            const imgFile = await convertBlobUrlToFile(url);

            const { imageUrl, error } = await uploadImage({
                file: imgFile,
                bucket: 'images/profiles',
            });

            if(error) throw new Error("Failed to upload image");

            return imageUrl;
        } catch(error: any){
            console.error(error);
            throw error;
        }
    }


    // --- Submit Handler ---
    async function onSumit(data: z.infer<typeof UpdateSchema>){
        startTransition(async() => {
            try{
                const oldImage = staff.profile_image;

                let newImageUrl = oldImage;

                if(imageUrls.length > 0){
                    newImageUrl = await uploadAllImages(oldImage);
                }

                const updateData = {
                    staff_id: data.staff_id,
                    name: data.name ?? staff.name,
                    profile_image: newImageUrl,
                    email: data.email,
                    password: data.password,
                };

                await updateStaff(staff.staff_id, updateData);

                document.getElementById("staff-trigger")?.click();
                toast.success("Admin updated successfully!");
                setImageUrls([]);
                } catch (error: any) {
                toast.error("Failed to update staff: " + error.message);
                }
                    
        });
    }

    return (
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSumit)}>
                {/* Profile Image */}
                <ProfileButton imageUrls={imageUrls} setImageUrls={setImageUrls}/>

                {/* Staff ID and Name */}
                <div className="flex">
             {/* Staff ID */}
                <FormField
                control={form.control}
                name="staff_id"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>ID: </FormLabel>
                        <FormControl>
                            <Input 
                            {...field}
                            value={field.value}
                            onChange={field.onChange}/>
                        </FormControl>
                    </FormItem>
                )}
                />

                {/* Staff Name */}
                <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Name: </FormLabel>
                        <FormControl>
                            <Input
                            {...field}
                            onChange={field.onChange}
                            value={field.value}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />

                </div>

                {/* Email ans Status */}
                <div className="flex">

                    {/* Email */}
                    <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email: </FormLabel>
                            <FormControl>
                                <Input
                                {...field}
                                onChange={field.onChange}
                                value={field.value}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                    />

                    {/* Status */}
                    <FormField
                    control={form.control}
                    name="status"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Status: </FormLabel>
                            <FormControl>
                                <Input
                                {...field}
                                onChange={field.onChange}
                                value={field.value}/>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                </div>

                {/* Password */}
                <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Password: </FormLabel>
                        <FormControl>
                            <Input 
                            {...field}
                            onChange={field.onChange}
                            value={field.value}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />

                <Button
                type="submit"
                >
                    Update{" "}
                    
            {isPending && (
              <AiOutlineLoading3Quarters className="animate-spin mr-2 inline-block" />
            )}
                </Button>
            </form>
        </Form>
    )
}
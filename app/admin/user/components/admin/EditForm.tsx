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
import { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { deleteImage, uploadImage } from "@/app/components/Image/actions/upload";
import ProfileButton from "@/app/components/Image/components/ProfileButton";
import { Admin } from "@/type/membertype";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { updateAdmin } from "../../actions";
import Image from "next/image";

const UpdateSchema = z.object({
  admin_id: z.string().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  profile_image: z.string().optional(),
});

export default function EditAdmin({ admin }: { admin: Admin }) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();


  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      admin_id: admin.admin_id,
      profile_image: admin.profile_image,
      email: admin.email,
      password: admin.password,
      name: admin.name,
    },
  });

  // Upload images
  async function uploadAllImage(oldImageUrl: string) {
    if (imageUrls.length === 0) return oldImageUrl;

    try {
      if (oldImageUrl) {
        await deleteImage({
          imageUrl: oldImageUrl,
          bucket: "images/profiles",
        });
      }

      const url = imageUrls[0];
      const imgFile = await convertBlobUrlToFile(url);

      const { imageUrl, error } = await uploadImage({
        file: imgFile,
        bucket: "images/profiles",
      });

      if (error) throw new Error("Failed to upload image");

      return imageUrl;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  // Submit handler
  async function onSubmit(data: z.infer<typeof UpdateSchema>) {
    startTransition(async () => {
      try {
        const oldImage = admin.profile_image;

        let newImageUrl = oldImage;

        if (imageUrls.length > 0) {
          newImageUrl = await uploadAllImage(oldImage);
        }

        const updateData = {
          admin_id: data.admin_id,
          name: data.name ?? admin.name,
          profile_image: newImageUrl,
          email: data.email,
          password: data.password,
        };

        await updateAdmin(admin.admin_id, updateData);

        document.getElementById("trigger")?.click();
        toast.success("Admin updated successfully!");
        setImageUrls([]);
      } catch (error: any) {
        toast.error("Failed to update admin: " + error.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Profile Image */}
        <ProfileButton imageUrls={imageUrls} setImageUrls={setImageUrls} oldImage={admin.profile_image} />

        {/* Member ID and Name */}
        <div className="flex gap-2">

        {/* Member ID */}
        <FormField
          control={form.control}
          name="admin_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member ID:</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Member Name */}
        <FormField
        control={form.control}
        name="name"
        render={({field}) => (
          <FormItem>
            <FormLabel>Name: </FormLabel>
            <FormControl>
              <Input
              defaultValue={field.value}
              onChange={field.onChange} 
              />
            </FormControl>
          </FormItem>
        )}/>
        </div>

        {/* Email and Password */}
        <div className="flex gap-2">

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
                />
              </FormControl>
            </FormItem>
          )}/>

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
                />
              </FormControl>
            </FormItem>
          )}
          />
        </div>
        <div className="flex justify-end">
          <Button
          onClick={() => document.getElementById("trigger")?.click()}
          className="border border-gray-500 rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className={cn("bg-blue-500 text-white rounded-xl")}
          >
            {isPending && (
              <AiOutlineLoading3Quarters className="animate-spin mr-2 inline-block" />
            )}
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}

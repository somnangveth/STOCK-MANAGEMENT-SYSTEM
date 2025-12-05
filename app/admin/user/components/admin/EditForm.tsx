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
import { getLoggedInUser } from "@/app/auth/actions";
import { createSupabaseBrowserClient } from "@/lib/storage/browser"; // Use browser client
import { useRouter } from "next/navigation";

const UpdateSchema = z.object({
  admin_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  profile_image: z.string().optional(),
});

export default function EditAdmin({ admin }: { admin: Admin }) {
  if(!admin) return null;
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      admin_id: admin.admin_id,
      profile_image: admin.profile_image,
      email: admin.email,
      password: "",  
      first_name: admin.first_name,
      last_name: admin?.last_name,
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

async function onSubmit(data: z.infer<typeof UpdateSchema>) {
  startTransition(async () => {
    try {
      
      // Handle image upload
      const oldImage = admin.profile_image;
      let newImageUrl = oldImage;
      if (imageUrls.length > 0) {
        newImageUrl = await uploadAllImage(oldImage);
      }

      const updateData: any = {
        first_name: data.first_name ?? admin.first_name,
        last_name: data.last_name ?? admin.last_name,
        profile_image: newImageUrl,
      };

      if (data.email && data.email !== admin.email) {
        updateData.email = data.email;
      }

      if (data.password && data.password.trim() !== "") {
        updateData.password = data.password;
      }

      const result = await updateAdmin(admin.admin_id, updateData);

      if (!result.success) {
        if (result.needsLogin) {
          toast.error("Session expired. Please log in again.");
          router.push('/auth');
          return;
        }
        throw new Error(result.error || "Failed to update admin");
      }

      // Refresh session
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.refreshSession();

      window.dispatchEvent(new Event('profileUpdated'));
      document.getElementById("trigger")?.click();
      toast.success("Admin updated successfully!");
      setImageUrls([]);
      router.refresh();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error("Failed to update admin: " + error.message);
    }
  });
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Profile Image */}
        <ProfileButton 
          imageUrls={imageUrls} 
          setImageUrls={setImageUrls} 
          oldImage={admin.profile_image} 
        />

        {/* Admin ID and First Name */}
        <div className="flex gap-2">
          {/* Admin ID */}
          <FormField
            control={form.control}
            name="admin_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Admin ID:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter admin ID" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>First Name:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter first name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Last Name */}
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name:</FormLabel>
              <FormControl>
                <Input
                  defaultValue={field.value}
                  {...field}
                  onChange={field.onChange}
                  placeholder="Enter last name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email and Password */}
        <div className="flex gap-2">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Password:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Leave blank to keep current"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => document.getElementById("trigger")?.click()}
            variant="outline"
            className="border border-gray-500 rounded-xl"
          >
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
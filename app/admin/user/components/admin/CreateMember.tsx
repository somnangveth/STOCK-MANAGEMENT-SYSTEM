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
import { 
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMember } from "../../actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { uploadImage } from "@/app/components/Image/actions/upload";
import ProfileButton from "@/app/components/Image/components/ProfileButton";

const FormSchema = z.object({
    id: z.string().nonempty("ID is required"),
    name: z.string().nonempty("Name is required"),
    profile_image: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(6, { message: "Password must be more than 6 characters" }),
    confirm: z.string()
        .min(6, { message: "Password must be more than 6 characters" }),
    role: z.enum(["staff", "admin"]),
    status: z.enum(["active", "resigned"]),
}).refine((data) => data.confirm === data.password, {
    message: "Password does not match",
    path: ["confirm"],
});

export default function MemberForm() {

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const roles = ["admin", "staff"];
    const statuses = ["active", "resigned"];

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: "",
            name: "",
            profile_image: "",
            email: "",
            password: "",
            confirm: "",
            role: "staff",
            status: "active",
        },
    });

    // Upload all images
    async function uploadAllImages() {
        const uploadUrls: string[] = [];

        for (const url of imageUrls) {
            const imageFile = await convertBlobUrlToFile(url);
            const { imageUrl, error } = await uploadImage({
                file: imageFile,
                bucket: "images/profiles",
            });

            if (error) throw new Error(error.message);
            uploadUrls.push(imageUrl);
        }

        return uploadUrls;
    }

    // Handle submit
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        startTransition(async () => {
            try {
                const uploadUrls = await uploadAllImages();
                if (uploadUrls.length > 0) {
                    data.profile_image = uploadUrls[0];
                }

                const result = await createMember(data);

                // Handle Supabase return (string or object)
                const parsed = typeof result === "string" ? JSON.parse(result) : result;
                const { error } = parsed;

                if (error?.message) {
                    toast.error("Failed to create member!");
                } else {
                    document.getElementById("create-trigger")?.click(); // ✅ fixed missing ()
                    toast.success("Member created successfully!");
                    form.reset(); 
                    setImageUrls([]);
                }
            } catch (error: any) {
                toast.error("Image upload failed", {
                    description: error.message,
                });
            }
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
            >
                {/* Profile Image */}
                <ProfileButton
                    imageUrls={imageUrls}
                    setImageUrls={setImageUrls}
                />

                {/* ID + Name */}
                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-gray-500">ID</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-gray-500">Name</FormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm text-gray-500">Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
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
                        <FormItem>
                            <FormLabel className="text-sm text-gray-500">Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Confirm Password */}
                <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm text-gray-500">Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Role */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm text-gray-500">Role</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Status */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm text-gray-500">Status</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Buttons */}
                <div className="flex w-full justify-end gap-2">
                    <Button
                        type="button"
                        className="bg-white border border-gray-500 rounded-xl text-black hover:text-white"
                        onClick={() => document.getElementById("create-trigger")?.click()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "border border-blue-700 text-blue-700 bg-blue-100 rounded-xl",
                            "hover:bg-blue-500 hover:text-white"
                        )}
                    >
                        {isPending ? (
                            <>
                                <AiOutlineLoading3Quarters className="inline-block animate-spin mr-2" />
                                Creating...
                            </>
                        ) : (
                            "Create Member"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

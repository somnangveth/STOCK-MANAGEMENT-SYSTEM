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
    first_name: z.string().nonempty("Firstname is required"),
    last_name: z.string().nonempty("Lastname is required"),
    profile_image: z.string(),
    email: z.string().email("Invalid email format"),
    password: z.string()
        .min(6, { message: "Password must be more than 6 characters" }),
    confirm: z.string()
        .min(6, { message: "Password must be more than 6 characters" }),
    role: z.enum(["staff", "admin"]),
    nationality: z.string().nonempty("Nationality must included"),
    date_of_birth: z.date(),
    martial_status: z.string(),
    gender: z.enum(['Male', 'Female']),
    primary_email_address: z.string(),
    personal_email_address: z.string(),
    primary_phone_number: z.string(),
}).refine((data) => data.confirm === data.password, {
    message: "Password does not match",
    path: ["confirm"],
});

export default function MemberForm() {
    //Hooks
    const [currentStep, setCurrentStep] = useState(1);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const roles = ["admin", "staff"];
    const genders = ['Male', 'Female'];

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: "",
            first_name: "",
            last_name: "",
            profile_image: "",
            email: "",
            password: "",
            confirm: "",
            role: "staff",
            gender: "Male",
            nationality: "",
            martial_status: "",
        },
    });

    // Styling
    const text = 'text-sm text-gray-500'

    //Validate step 1 fields
    async function validateStep1(){
        const fieldsToValidate = [
            'id',
            'first_name',
            'last_name',
            'email',
            'password',
            'confirm',
            'role',
            'nationality',
            'date_of_birth',
            'martial_status',
            'gender',
        ] as const;
        const isValid = await form.trigger(fieldsToValidate);
        return isValid;
    }

    async function handleNext(){
        const isValid = await validateStep1();

        if(isValid){
            setCurrentStep(2);
        }
    }

    function handBack(){
        setCurrentStep(1)
    }

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
                    document.getElementById("create-trigger")?.click(); 
                    toast.success("Member created successfully!");
                    form.reset(); 
                    setCurrentStep(1);
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
        <div>
            <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">
                    {currentStep === 1 ? "Personal Information" : "Contact Information"}
                </h3>
            </div>

        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2">

                {/* Personal Information */}
                {currentStep === 1 && (
                    <div className="space-y-1">
                        <ProfileButton
                        imageUrls={imageUrls}
                        setImageUrls={setImageUrls}
                        />

                        {/* ID  */}
                        <FormField
                        control={form.control}
                        name="id"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={text}>ID: </FormLabel>
                                <FormControl>
                                    <Input 
                                    type="text"
                                    {...field}
                                    onChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                        />

                        {/* FirstName + LastName */}
                        <div className="flex gap-2">
                            {/* Firstname */}
                        <FormField
                        control={form.control}
                        name="first_name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={text}>Firstname: </FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Firstname"
                                    type="text"
                                    {...field}
                                    onChange={field.onChange}/>
                                </FormControl>
                            </FormItem>
                        )}/>

                        {/* Lastname */}
                        <FormField
                        control={form.control}
                        name="last_name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={text}>Lastname: </FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Lastname"
                                    type="text"
                                    {...field}
                                    onChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}/>
                        </div>

                        {/* Nationality and Date of Birth */}
                        <div>
                            {/* Nationality */}
                            <FormField
                            control={form.control}
                            name="nationality"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Nationality: </FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder="Nationality"
                                        type="text"
                                        {...field}
                                        onChange={field.onChange}/>
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* Date of Birth */}
                            <FormField
                            control={form.control}
                            name="date_of_birth"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Date of Birth: </FormLabel>
                                    <FormControl>
                                        <Input
                                        type="date"
                                        placeholder="Date of Birth"
                                        onChange={(e) => field.onChange(new Date(e.target.value))}
                                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>

                        {/* Martial Status and Gender */}
                        <div className="flex gap-2">
                            {/* Martial Status */}
                            <FormField
                            control={form.control}
                            name="martial_status"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Martial Status</FormLabel>
                                    <FormControl>
                                        <Input
                                        type="text"
                                        {...field}
                                        onChange={field.onChange}/>
                                    </FormControl>
                                </FormItem>
                            )}/>

                            {/* Gender */}
                            <FormField
                            control={form.control}
                            name="gender"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Gender: </FormLabel>
                                    <FormControl>
                                        <Select
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder=""/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {genders.map((gender) => (
                                                   <SelectItem key={gender} value={gender}>
                                                    {gender}
                                                   </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}/>
                        </div>

                        {/* Role and Email */}
                        <div className="flex gap-2">
                            {/* Email */}
                            <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>
                                        Email: 
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                        type="text"
                                        placeholder="example@gmail.com"
                                        {...field}
                                        onChange={field.onChange}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            {/* Role */}
                            <FormField
                            control={form.control}
                            name="role"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Role: </FormLabel>
                                    <FormControl>
                                        <Select
                                        value={field.value}
                                        onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder=""/>
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
                                </FormItem>
                            )}/>
                        </div>

                        {/* Password and Confirm */}
                        <div className="flex gap-2">
                            {/* Password */}
                            <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Password: </FormLabel>
                                    <FormControl>
                                        <Input
                                        type="password"
                                        {...field}
                                        onChange={field.onChange}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>

                            {/* Confirm */}
                            <FormField
                            control={form.control}
                            name="confirm"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className={text}>Confirm: </FormLabel>
                                    <FormControl>
                                        <Input
                                        type="password"
                                        placeholder="confirm"
                                        {...field}
                                        onChange={field.onChange}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-2">
                        {/* Primary Email */}
                        <FormField
                        control={form.control}
                        name="primary_email_address"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={text}>Primary email address: </FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="primary email address"
                                    {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>

                        {/* Personal Email Address */}
                        <FormField
                        control={form.control}
                        name="personal_email_address"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={text}>Personal email address: </FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Personal email address"
                                    {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>

                        {/* Primary Phone Number */}
                        <FormField
                        control={form.control}
                        name="primary_phone_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className={text}>Primary phone number:</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="primary phone number"
                                    {...field}/>
                                </FormControl>
                            </FormItem>
                        )}/>
                    </div>
                )}

                <div className="flex w-full justify-end gap-2 pt-4">
                    {currentStep === 1 ? (
                        <>
                        <Button
                        type="button"
                        className="bg-white border border-gray-500 rounded-xl text-black hover:text-white"
                        onClick={() => document.getElementById('create-trigger')?.click()}>
                            Cancel
                        </Button>
                        <Button
                        type="button"
                        onClick={handleNext}
                        className={cn(
                            "border border-blue-700 text-blue-700 bg-blue-100 rounded-xl",
                            "hover:bg-blue-500 hover:text-white"
                        )}>
                            Next
                        </Button>
                        </>
                    ): (
                        <>
                        <Button
                        type="button"
                        onClick={handBack}>
                            Back
                        </Button>
                        <Button
                        type="submit"
                        disabled= {isPending}
                        className={cn(
                            "border border-blue-700 text-blue-700 bg-blue-100 rounded-xl",
                            "hover:bg-blue-500 hover:text-white"
                        )}
                        >
                            {isPending ? (
                                <>
                                <AiOutlineLoading3Quarters className="inline-block animate-spin mr-2"/>
                                Creating...
                                </>
                            ): (
                                "Create Member"
                            )}
                        </Button>
                        </>
                    )}
                </div>
            </form>
        </Form>
        </div>
    );
}

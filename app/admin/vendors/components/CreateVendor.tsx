"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import ProfileButton from "@/app/components/Image/components/ProfileButton";
import { createVendor } from "../actions/vendor";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { uploadImage } from "@/app/components/Image/actions/upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Step-based validation schemas
const step1Schema = z.object({
  vendor_id: z.string().min(1, "Vendor ID is required"),
  vendor_name: z.string().min(1, "Vendor name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  vendor_email: z.string().email("Invalid email address"),
  vendor_type: z.enum(["local", "non-local"]),
});

const step2Schema = z.object({
  phone_number1: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

const FormSchema = z.object({
  vendor_id: z.string().min(1, "Vendor ID is required"),
  vendor_name: z.string().min(1, "Vendor name is required"),
  contact_person: z.string().min(1, "Contact person is required"),
  vendor_email: z.string().email("Invalid email address"),
  vendor_type: z.enum(["local", "non-local"]),
  phone_number1: z.string().min(1, "Phone number is required"),
  phone_number2: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  source_link: z.string().url("Invalid URL").optional().or(z.literal("")),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
  vendor_image: z.string().optional(),
});

export default function CreateVendors() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      vendor_id: "",
      vendor_name: "",
      contact_person: "",
      vendor_email: "",
      vendor_type: "local",
      phone_number1: "",
      phone_number2: "",
      address: "",
      city: "",
      country: "",
      source_link: "",
      payment_terms: "",
      notes: "",
      vendor_image: "",
    },
  });

  const steps = [
    {
      step: 1,
      title: "Basic Information",
      fields: ["vendor_id", "vendor_name", "contact_person", "vendor_email", "vendor_type"],
    },
    {
      step: 2,
      title: "Contact Details",
      fields: ["phone_number1", "phone_number2", "address", "city", "country"],
    },
    {
      step: 3,
      title: "Additional Information",
      fields: ["source_link", "payment_terms", "notes"],
    },
  ];

  // Next step with validation
  const nextStep = async () => {
    let isValid = false;

    // Validate only current step fields
    if (currentStep === 1) {
      const data = form.getValues();
      const result = step1Schema.safeParse({
        vendor_id: data.vendor_id,
        vendor_name: data.vendor_name,
        contact_person: data.contact_person,
        vendor_email: data.vendor_email,
        vendor_type: data.vendor_type,
      });

      if (!result.success) {
        // Set errors for step 1 fields
        result.error.errors.forEach((err) => {
          form.setError(err.path[0] as any, {
            type: "manual",
            message: err.message,
          });
        });
        toast.error("Please complete all required fields correctly");
        return;
      }
      isValid = true;
    } else if (currentStep === 2) {
      const data = form.getValues();
      const result = step2Schema.safeParse({
        phone_number1: data.phone_number1,
        address: data.address,
        city: data.city,
        country: data.country,
      });

      if (!result.success) {
        // Set errors for step 2 fields
        result.error.errors.forEach((err) => {
          form.setError(err.path[0] as any, {
            type: "manual",
            message: err.message,
          });
        });
        toast.error("Please complete all required fields correctly");
        return;
      }
      isValid = true;
    }

    if (isValid) {
      setCurrentStep((s) => s + 1);
    }
  };

  // Previous step
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  // Submit form
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      try {
        // Upload image if exists
        if (imageUrls.length > 0) {
          const file = await convertBlobUrlToFile(imageUrls[0]);
          const { imageUrl } = await uploadImage({
            file,
            bucket: "images/profiles",
          });
          data.vendor_image = imageUrl;
        }

        const result = await createVendor(data);
        const parsed = typeof result === "string" ? JSON.parse(result) : result;

        if (parsed?.error) {
          toast.error(parsed.error || "Failed to create vendor");
        } else {
          toast.success("Vendor created successfully");
          form.reset();
          setImageUrls([]);
          setCurrentStep(1);
        }
      } catch (error) {
        console.error("Create vendor error:", error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Vendor</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, idx) => (
              <div key={step.step} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors",
                    currentStep >= step.step
                      ? "bg-amber-700 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {currentStep > step.step ? <Check className="w-5 h-5" /> : step.step}
                </div>
                <span className="text-xs mt-2 text-center">{step.title}</span>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-1 flex-1 mx-2 transition-colors",
                      currentStep > step.step ? "bg-amber-700" : "bg-gray-200"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <ProfileButton imageUrls={imageUrls} setImageUrls={setImageUrls} />

              <FormField
                control={form.control}
                name="vendor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contact person name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="vendor@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="local">Local</SelectItem>
                        <SelectItem value="non-local">Non-Local</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STEP 2: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="phone_number1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890 (Optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="source_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website / Source Link</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Net 30, COD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional information about the vendor"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isPending}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep} disabled={isPending}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Vendor"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
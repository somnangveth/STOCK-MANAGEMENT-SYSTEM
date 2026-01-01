'use client';

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { updateVendor } from "../actions/vendor";
import { deleteImage, uploadImage } from "@/app/components/Image/actions/upload";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import UploadImageButton from "@/app/components/Image/components/ImageButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Vendors } from "@/type/productType";

const UpdateSchema = z.object({
  vendor_id: z.string().min(1),
  vendor_name: z.string().min(1),
  contact_person: z.string().min(1),
  phone_number1: z.string().min(1),
  phone_number2: z.string().optional(),
  vendor_email: z.string().email(),
  vendor_image: z.string().optional(),
  source_link: z.string().url().optional().or(z.literal("")),
  vendor_type: z.enum(["local", "non-local"]),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
});

export default function EditVendorPage({ vendor }: { vendor?: Vendors }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // ✅ 关键：vendor 还没来之前不要渲染
  if (!vendor) {
    return <div className="p-6 text-gray-500">Loading vendor...</div>;
  }

  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      vendor_id: "",
      vendor_name: "",
      contact_person: "",
      phone_number1: "",
      phone_number2: "",
      vendor_email: "",
      vendor_image: "",
      source_link: "",
      address: "",
      city: "",
      country: "",
      payment_terms: "",
      notes: "",
      vendor_type: "local",
    },
  });

  // ✅ 等 vendor 到了再灌数据
  useEffect(() => {
    form.reset({
      vendor_id: String(vendor.vendor_id),
      vendor_name: vendor.vendor_name ?? "",
      contact_person: vendor.contact_person ?? "",
      phone_number1: vendor.phone_number1 ?? "",
      phone_number2: vendor.phone_number2 ?? "",
      vendor_email: vendor.vendor_email ?? "",
      vendor_image: vendor.vendor_image ?? "",
      source_link: vendor.source_link ?? "",
      address: vendor.address ?? "",
      city: vendor.city ?? "",
      country: vendor.country ?? "",
      payment_terms: vendor.payment_terms ?? "",
      notes: vendor.notes ?? "",
      vendor_type: vendor.vendortype as "local" | "non-local",
    });
  }, [vendor, form]);

  async function uploadAllImages(oldImageUrl?: string) {
    if (imageUrls.length === 0) return oldImageUrl;

    if (oldImageUrl) {
      await deleteImage({ imageUrl: oldImageUrl, bucket: "images" });
    }

    const file = await convertBlobUrlToFile(imageUrls[0]);
    const { imageUrl } = await uploadImage({
      file,
      bucket: "images",
    });

    return imageUrl;
  }

  function onSubmit(data: z.infer<typeof UpdateSchema>) {
    startTransition(async () => {
      try {
        const newImageUrl =
          imageUrls.length > 0
            ? await uploadAllImages(vendor.vendor_image)
            : vendor.vendor_image;

        const result = await updateVendor(vendor.vendor_id, {
          ...data,
          vendor_image: newImageUrl,
        });

        if (result?.error) {
          toast.error("Update failed", { description: result.error });
        } else {
          toast.success("Vendor updated successfully");
        }
      } catch (err) {
        console.error(err);
        toast.error("Unexpected error");
      }
    });
  }

  const nextStep = async () => {
    const valid = await form.trigger();
    if (valid && currentStep < 3) setCurrentStep(s => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress */}
        <div className="flex items-center mb-6">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                )}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-2",
                    currentStep > step ? "bg-blue-600" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <>
            <UploadImageButton
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
            />

            <FormField
              control={form.control}
              name="vendor_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <>
            <FormField
              control={form.control}
              name="phone_number1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Update Vendor"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

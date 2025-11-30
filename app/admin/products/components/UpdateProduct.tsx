'use client';
import { Categories, Product, Subcategories } from "@/type/productType";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVendors, updateProduct } from "@/app/functions/stock/product/product";
import { deleteImage, uploadImage } from "@/app/components/Image/actions/upload";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import UploadImageButton from "@/app/components/Image/components/ImageButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";

const UpdateSchema = z.object({
  sku_code: z.string().nonempty("Product ID is required"),
  product_name: z.string().nonempty("Product Name is required"),
  product_image: z.string().optional(),
  description: z.string().nonempty("Description is required"),
  slug: z.string().nonempty("Slug is required"),
  category_id: z.string().nonempty("Category is required"),
  subcategory_id: z.string().nonempty("Subcategory is required"),
  vendor_id: z.string().nonempty("Vendor is required"),
  min_stock_level: z.number().min(0, "Minimum stock level is required"),
  max_stock_level: z.number().min(0, "Maximum stock level is required"),
  default_shelf_life_days: z.number().min(0, "Default shelf life is required"),
  base_unit: z.string().nonempty("Base unit is required"),
  units_per_package: z.number().min(1, "Units per package is required"),
  package_type: z.enum(['box', 'case']),
});

export default function UpdateProduct({ product }: { product: Product }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [vendors, setVendor] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const text = 'text-gray-500';

  const form = useForm<z.infer<typeof UpdateSchema>>({
    resolver: zodResolver(UpdateSchema),
    defaultValues: {
      sku_code: product.sku_code,
      product_name: product.product_name,
      product_image: product.product_image,
      description: product.description,
      slug: product.slug,
      category_id: String(product.category_id),
      subcategory_id: String(product.subcategory_id),
      vendor_id: String(product.vendor_id),
      min_stock_level: product.min_stock_level,
      max_stock_level: product.max_stock_level,
      default_shelf_life_days: product.default_shelf_life_days,
      base_unit: product.base_unit,
      units_per_package: product.units_per_package,
      package_type: product.package_type,
    }
  });

  async function fetchCategoryAndSubcategory() {
    const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  }

  const selectedCategoryId = form.watch('category_id');

  const { data, isLoading, error } = useQuery<{ categories: Categories[]; subcategories: Subcategories[] }>({
    queryKey: ["categories-subcategories"],
    queryFn: fetchCategoryAndSubcategory,
  });

  const filteredSubcategories = data?.subcategories.filter(
    (sub) => String(sub.category_id) === String(selectedCategoryId),
  ) || [];

  useEffect(() => {
    async function loadVendors() {
      try {
        const vendorData = await fetchVendors();
        setVendor(vendorData);
      } catch (error) {
        console.error("Failed to fetch vendor data");
      }
    }
    loadVendors();
  }, []);

  useEffect(() => {
    if (selectedCategoryId !== String(product.category_id)) {
      form.setValue('subcategory_id', '');
    }
  }, [selectedCategoryId, form, product.category_id]);

  if (isLoading) return <p>Loading Categories...</p>;
  if (error || !data) return <p>Failed to fetch categories</p>;

  async function uploadAllImages(oldImageUrl?: string) {
    if (imageUrls.length === 0) return oldImageUrl;

    try {
      if (oldImageUrl) {
        await deleteImage({ imageUrl: oldImageUrl, bucket: 'images' });
      }

      const uploadedUrls: string[] = [];
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);
        const { imageUrl } = await uploadImage({ file: imageFile, bucket: 'images' });
        uploadedUrls.push(imageUrl);
      }

      return uploadedUrls[0];
    } catch (error) {
      console.error('Image upload failed', error);
      return oldImageUrl;
    }
  }

  function onSubmit(data: z.infer<typeof UpdateSchema>) {
    startTransition(async () => {
      try {
        const newImageUrl = imageUrls.length > 0
          ? await uploadAllImages(product.product_image)
          : product.product_image;

        const updatedData = {
          ...data,
          product_image: newImageUrl,
        };

        const result = JSON.parse(await updateProduct(product.product_id, updatedData));

        if (result?.error) {
          toast.error("Failed to update", { description: result.error });
        } else {
          toast.success("Product updated successfully");
        }
      } catch (error) {
        console.error(error);
        toast.error("Unexpected error");
      }
    });
  }

  const nextStep = async () => {
    const isValid = await form.trigger();
    if (isValid && currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const currentSubcategory = data?.subcategories.find(
    (sub) => String(sub.subcategory_id) === String(product.subcategory_id)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1,2,3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              )}>{step}</div>
              {step < 3 && <div className={cn(
                "flex-1 h-1 mx-2 transition-colors",
                currentStep > step ? "bg-blue-600" : "bg-gray-200"
              )} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
            <UploadImageButton imageUrls={imageUrls} setImageUrls={setImageUrls} />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Product ID *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    {form.formState.errors.sku_code && <p className="text-red-500 text-sm">{form.formState.errors.sku_code.message}</p>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Product Name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    {form.formState.errors.product_name && <p className="text-red-500 text-sm">{form.formState.errors.product_name.message}</p>}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Slug *</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  {form.formState.errors.slug && <p className="text-red-500 text-sm">{form.formState.errors.slug.message}</p>}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Description *</FormLabel>
                  <FormControl><Textarea {...field} /></FormControl>
                  {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Category & Vendor</h2>

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Category *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder='Select a category' /></SelectTrigger>
                      <SelectContent>
                        {data.categories.map((cat) => (
                          <SelectItem key={cat.category_id} value={String(cat.category_id)}>{cat.category_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.category_id && <p className="text-red-500 text-sm">{form.formState.errors.category_id.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Subcategory *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={!selectedCategoryId}>
                      <SelectTrigger><SelectValue placeholder={currentSubcategory?.subcategory_name || "Select subcategory"} /></SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.map((sub) => (
                          <SelectItem key={sub.subcategory_id} value={String(sub.subcategory_id)}>{sub.subcategory_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.subcategory_id && <p className="text-red-500 text-sm">{form.formState.errors.subcategory_id.message}</p>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Vendor *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder='Select a vendor' /></SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor: any) => (
                          <SelectItem key={vendor.vendor_id} value={String(vendor.vendor_id)}>{vendor.vendor_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.vendor_id && <p className="text-red-500 text-sm">{form.formState.errors.vendor_id.message}</p>}
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Stock & Package</h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Minimum Stock *</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    {form.formState.errors.min_stock_level && <p className="text-red-500 text-sm">{form.formState.errors.min_stock_level.message}</p>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Maximum Stock *</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    {form.formState.errors.max_stock_level && <p className="text-red-500 text-sm">{form.formState.errors.max_stock_level.message}</p>}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="default_shelf_life_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Default Shelf Days *</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  {form.formState.errors.default_shelf_life_days && <p className="text-red-500 text-sm">{form.formState.errors.default_shelf_life_days.message}</p>}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="base_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Base Unit *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    {form.formState.errors.base_unit && <p className="text-red-500 text-sm">{form.formState.errors.base_unit.message}</p>}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="units_per_package"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Units per Package *</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    {form.formState.errors.units_per_package && <p className="text-red-500 text-sm">{form.formState.errors.units_per_package.message}</p>}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="package_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Package Type *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select package type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="case">Case</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {currentStep > 1 && <Button type="button" variant="outline" onClick={prevStep}>Previous</Button>}
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep}>Next</Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Update Product"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

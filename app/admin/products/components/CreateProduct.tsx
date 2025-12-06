"use client";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { uploadImage } from "@/app/components/Image/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createProduct, fetchCategoriesAndSubcategories, fetchVendors } from "@/app/functions/stock/product/product";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import UploadImageButton from "@/app/components/Image/components/ImageButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Categories, Subcategories } from "@/type/productType";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { btnStyle } from "@/app/components/Icons";
import { styledToast } from "@/app/components/Toast";

const FormSchema = z.object({
  //Product Data
  sku_code: z.string().min(1, "SKU code is required"),
  product_name: z.string().min(1, "Product name is required"),
  product_image: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  category_id: z.string().min(1, "Category is required"),
  subcategory_id: z.string().min(1, "Subcategory is required"),
  vendor_id: z.string().min(1, "Vendor is required"),
  min_stock_level: z.number().min(0, "Must be 0 or greater"),
  max_stock_level: z.number().min(1, "Must be greater than 0"),
  default_shelf_life_days: z.number().min(1, "Must be at least 1 day"),
  base_unit: z.string().min(1, "Base unit is required"),
  units_per_package: z.number().min(1, "Must be at least 1"),
  package_type: z.enum(['box', 'case']),
  
  //Product_Batch
  batch_number: z.string().min(1, "Batch number is required"),
  manufacture_date: z.date("Manufacture date is required"),
  expiry_date: z.date("Expiry date is required"),
  cost_price: z.number().min(0, "Cost price must be 0 or greater"),
  recieved_date: z.date("Received date is required"),
  note: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  packages_recieved: z.number().min(1, "Packages received must be at least 1"),
});

export default function CreateProduct({onSuccess}: {onSuccess?: () =>void }) {
  // --- Hooks ---
  const [vendor, setVendor] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(1);

  //Styling
  const text = 'text-sm text-gray-500';
  const text_red = 'text-sm text-red-500';
  const grid2cols = 'grid grid-cols-2 gap-4';

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sku_code: "",
      product_name: "",
      product_image: "",
      description: "",
      slug: '',
      category_id: '',
      subcategory_id: '',
      vendor_id: '',
      min_stock_level: 0,
      max_stock_level: 0,
      default_shelf_life_days: 7,
      base_unit: '',
      units_per_package: 1,
      package_type: 'box',
      batch_number: "",
      cost_price: 0,
      note: "",
      quantity: 1,
      packages_recieved: 1,
    }
  });

  //Fetch Subcategories and Categories
  async function fetchCategoryAndSubcategory(){
    const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
    if(!res.ok) throw new Error('Failed to fetch Categories and Subcategories');
    return res.json();
  }

  const selectedCategoryId = form.watch('category_id');

  const {data, isLoading, error} = useQuery<{categories: Categories[]; subcategories: Subcategories[]}>({
    queryKey: ["categories-subcategories"],
    queryFn: fetchCategoryAndSubcategory,
  });

  const filteredSubcategories = data?.subcategories.filter(
    (sub)=> String(sub.category_id) === String(selectedCategoryId),
  )||[];

  useEffect(()=> {
    form.setValue('subcategory_id', '');
  }, [selectedCategoryId, form]);

  useEffect(()=>{
    async function loadVendors(){
      try{
        const vendorData = await fetchVendors();
        setVendor(vendorData);
      }catch(error){
        throw new Error('Failed to fetch vendor datas');
      }
    }
    loadVendors();
  },[]);

  if(isLoading) return <p>Loading Categories...</p>;
  if(error || !data) return <p>Failed to fetch categories</p>;

  async function uploadAllImages() {
    const uploadUrls: string[] = [];
    for (const url of imageUrls) {
      const imageFile = await convertBlobUrlToFile(url);
      const { imageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "images",
      });
      if (error) throw new Error(error.message);
      uploadUrls.push(imageUrl);
    }
    return uploadUrls;
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const uploadUrls = await uploadAllImages();
        if (uploadUrls.length > 0) {
          data.product_image = uploadUrls[0];
        }
        const result = await createProduct(data);
        const parsed = typeof result === "string" ? JSON.parse(result) : result;
        const { error } = parsed;
        if (error?.message) {
          styledToast.error("Failed to create product", error.message);
        } else {
          document.getElementById("product-trigger")?.click();
          styledToast.success("Add Product Successfully!")
          form.reset();
          onSuccess?.();
          setImageUrls([]);
          setCurrentStep(1);
        }
      } catch (error: any) {
        toast.error("Failed to create product", {
          description: error.message,
        });
      }
    });
  }

  //Steps
  const steps = [
    {
      number: 1,
      title: 'Product Info',
      field: ["sku_code", "product_name", "description", "slug"]
    },
    {
      number: 2,
      title: 'Categories',
      field: ["category_id", "subcategory_id", "vendor_id"]
    },
    {
      number: 3,
      title: 'Stock Info',
      field: ["min_stock_level", "max_stock_level", "default_shelf_life_days", "base_unit", "units_per_package", "package_type"]
    },
    {
      number: 4,
      title: 'Batch Info',
      field: ["batch_number", "manufacture_date", "expiry_date", "cost_price", "recieved_date", "note", "quantity", "packages_recieved"]
    }
  ];

  // Validate current step
  const validateStep = async () => {
    const currentFields = steps[currentStep -1].field;
    const isValid = await form.trigger(currentFields as any);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 text-sm rounded-full flex items-center justify-center font-semibold transition-all duration-300",
                  currentStep > step.number
                  ? "bg-amber-700 text-white"
                  : currentStep === step.number
                    ? "bg-yellow-100 text-amber-700 shadow-lg ring-4 ring-amber-100" 
                    : "bg-gray-200 text-gray-400"
                )}>
                  {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
                </div>

                <span className={cn(
                    "text-sm mt-2 font-medium transition-colors",
                    currentStep >= step.number ? "text-gray-700" : "text-gray-400"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "h-1 flex-1 mx-4 rounded transition-colors duration-300",
                    currentStep > step.number ? "bg-amber-700" : "bg-gray-200"
                  )} />
                )}
              </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Step 1: Basic Information</h2>
            <UploadImageButton imageUrls={imageUrls} setImageUrls={setImageUrls} />
            <div className={grid2cols}>
              <FormField
                control={form.control}
                name="sku_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Product ID *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="SKU-001" {...field} />
                    </FormControl>
                    {form.formState.errors.sku_code && (
                      <p className={text_red}>{form.formState.errors.sku_code.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="product_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Product Name *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Product name" {...field} />
                    </FormControl>
                    {form.formState.errors.product_name && (
                      <p className={text_red}>{form.formState.errors.product_name.message}</p>
                    )}
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
                  <FormControl>
                    <Input type="text" placeholder="product-slug" {...field} />
                  </FormControl>
                  {form.formState.errors.slug && (
                    <p className={text_red}>{form.formState.errors.slug.message}</p>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description..." {...field} />
                  </FormControl>
                  {form.formState.errors.description && (
                    <p className={text_red}>{form.formState.errors.description.message}</p>
                  )}
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 2: Categories & Vendor */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Step 2: Categories & Vendor</h2>
            {/* Category */}
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Category *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value} >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a Category'/>
                      </SelectTrigger>
                      <SelectContent>
                        {data?.categories.map((cat: Categories) => (
                          <SelectItem key={cat.category_id} value={String(cat.category_id)}>
                            {cat.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.category_id && (
                    <p className={text_red}>{form.formState.errors.category_id.message}</p>
                  )}
                </FormItem>
              )}
            />
            {/* Subcategory */}
            <FormField
              control={form.control}
              name="subcategory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Subcategory *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                      disabled= {!selectedCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a subcategory'/>
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.map((sub:Subcategories)=> (
                          <SelectItem key={sub.subcategory_id} value={String(sub.subcategory_id)}>
                            {sub.subcategory_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.subcategory_id && (
                    <p className={text_red}>{form.formState.errors.subcategory_id.message}</p>
                  )}
                </FormItem>
              )}
            />
            {/* Vendor */}
            <FormField
              control={form.control}
              name="vendor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Vendor *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a vendor'/>
                      </SelectTrigger>
                      <SelectContent>
                        {vendor.map((vendor:any)=> (
                          <SelectItem key={vendor.vendor_id}  value={String(vendor.vendor_id)}>
                            {vendor.vendor_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {form.formState.errors.vendor_id && (
                    <p className={text_red}>{form.formState.errors.vendor_id.message}</p>
                  )}
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 3: Stock & Package Information */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Step 3: Stock & Package Information</h2>
            <div className={grid2cols}>
              {/* Min Stock Level */}
              <FormField
                control={form.control}
                name="min_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Minimum Stock Level *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    {form.formState.errors.min_stock_level && (
                      <p className={text_red}>{form.formState.errors.min_stock_level.message}</p>
                    )}
                  </FormItem>
                )}
              />
              {/* Max Stock Level */}
              <FormField
                control={form.control}
                name="max_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Maximum Stock Level *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    {form.formState.errors.max_stock_level && (
                      <p className={text_red}>{form.formState.errors.max_stock_level.message}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>
            {/* Default Shelf Life Days */}
            <FormField
              control={form.control}
              name="default_shelf_life_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Default Shelf Days *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {form.formState.errors.default_shelf_life_days && (
                    <p className={text_red}>{form.formState.errors.default_shelf_life_days.message}</p>
                  )}
                </FormItem>
              )}
            />
            <div className={grid2cols}>
              {/* Base unit */}
              <FormField
                control={form.control}
                name="base_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Base Unit *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., kg, liter" {...field} />
                    </FormControl>
                    {form.formState.errors.base_unit && (
                      <p className={text_red}>{form.formState.errors.base_unit.message}</p>
                    )}
                  </FormItem>
                )}
              />
              {/* Units Per Package */}
              <FormField
                control={form.control}
                name="units_per_package"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={text}>Units Per Package *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    {form.formState.errors.units_per_package && (
                      <p className={text_red}>{form.formState.errors.units_per_package.message}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>
            {/* Package Type */}
            <FormField
              control={form.control}
              name="package_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Package Type *</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="box">Box</option>
                      <option value="case">Case</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Step 4: Product Batch Info */}
        {currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Step 4: Product Batch Information</h2>

          <div className={grid2cols}>
            {/* Batch Number */}
            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Batch Number *</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g., B-0001" {...field} />
                  </FormControl>
                  {form.formState.errors.batch_number && (
                    <p className={text_red}>{form.formState.errors.batch_number.message}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Manufacture Date */}
            <FormField
              control={form.control}
              name="manufacture_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Manufacture Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  {form.formState.errors.manufacture_date && (
                    <p className={text_red}>
                      {form.formState.errors.manufacture_date.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Expiry Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  {form.formState.errors.expiry_date && (
                    <p className={text_red}>
                      {form.formState.errors.expiry_date.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Received Date */}
            <FormField
              control={form.control}
              name="recieved_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Received Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  {form.formState.errors.recieved_date && (
                    <p className={text_red}>
                      {form.formState.errors.recieved_date.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Cost Price */}
            <FormField
              control={form.control}
              name="cost_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Cost Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {form.formState.errors.cost_price && (
                    <p className={text_red}>
                      {form.formState.errors.cost_price.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {form.formState.errors.quantity && (
                    <p className={text_red}>
                      {form.formState.errors.quantity.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Packages Received */}
            <FormField
              control={form.control}
              name="packages_recieved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={text}>Packages Received *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {form.formState.errors.packages_recieved && (
                    <p className={text_red}>
                      {form.formState.errors.packages_recieved.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Note */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={text}>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Additional notes..." {...field} />
                </FormControl>
                {form.formState.errors.note && (
                  <p className={text_red}>{form.formState.errors.note.message}</p>
                )}
              </FormItem>
            )}
          />
        </div>
        )}


              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isPending}
                    className={btnStyle}
                  >
                    {isPending ? (
                      <>
                        <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Product
                      </>
                    )}
                  </Button>
                )}
              </div>
      </form>
    </Form>
  );
}
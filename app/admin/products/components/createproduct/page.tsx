"use client";
import { convertBlobUrlToFile } from "@/app/components/Image/actions/image";
import { uploadImage } from "@/app/components/Image/actions/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createProduct, fetchVendors } from "@/app/functions/admin/stock/product/product";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import UploadImageButton from "@/app/components/Image/components/ImageButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Categories, Subcategories } from "@/type/productType";
import { ArrowLeft } from "lucide-react";
import { styledToast } from "@/app/components/Toast";
import { fetchCategoryAndSubcategory } from "@/app/functions/admin/api/controller";
import { useRouter } from "next/navigation";
import VendorForm from "@/app/admin/vendors/components/VendorForm";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

const FormSchema = z.object({

  //Product Details
  sku_code: z.string().min(1, "SKU code is required"),
  product_name: z.string().min(1, "Product name is required"),
  product_image: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  product_location: z.string().min(1, "Product Location is required"),
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

  //Price for B2C
  base_price: z.number().min(0, "Must be 0 or greater"),
  tax: z.number().min(0, "Must be 0 or greater"),
  profit_price: z.number().min(0, "Must be 0 or greater"),
  shipping: z.number().min(0, "Must be 0 or greater"),
  discount: z.number().min(0, "Must be 0 or greater"),
  total_price: z.number().min(0, "Must be 0 or greater"),

  //Price for B2B
  base_price_b2b: z.number().min(0, "Must be 0 or greater"),
  tax_b2b: z.number().min(0, "Must be 0 or greater"),
  profit_price_b2b: z.number().min(0, "Must be 0 or greater"),
  shipping_b2b: z.number().min(0, "Must be 0 or greater"),
  discount_b2b: z.number().min(0, "Must be 0 or greater"),
  b2b_price: z.number().min(0, "Must be 0 or greater"),

  //Batch Details
  batch_number: z.string().min(1, "Batch number is required"),
  manufacture_date: z.date(),
  expiry_date: z.date(),
  recieved_date: z.date(),
  note: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  packages_recieved: z.number().min(1, "Packages received must be at least 1"),
});

export default function CreateProduct({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [vendor, setVendor] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

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
      product_location: '',
      base_price: 0,
      tax: 0,
      total_price: 0,
      profit_price: 0,
      shipping: 0,
      discount: 0,
      b2b_price: 0,
      batch_number: "",
      note: "",
      quantity: 1,
      packages_recieved: 1,
    }
  });

  //Styling
  const text = "text-sm text-gray-500";
  const line = <div className="flex-1 border-b border-gray-300"></div>;

  // Calculate total price for B2C
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      const priceFields = ['base_price', 'tax', 'profit_price', 'shipping', 'discount'];
      
      if (priceFields.includes(name as string)) {
        const base_price = value.base_price || 0;
        const tax_percent = value.tax || 0;
        const profit_price = value.profit_price || 0;
        const shipping = value.shipping || 0;
        const discount_percent = value.discount || 0;
        
        const subtotal = base_price + profit_price + shipping;
        const taxAmount = (subtotal * tax_percent) / 100;
        const totalBeforeDiscount = subtotal + taxAmount;
        const discountAmount = (totalBeforeDiscount * discount_percent) / 100;
        const total = totalBeforeDiscount - discountAmount;
        
        form.setValue('total_price', Math.max(0, total));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
  const subscription = form.watch((value, {name}) => {
    const priceFields = ['base_price_b2b', 'tax_b2b', 'profit_price_b2b', 'shipping_b2b', 'discount_price_b2b'];

    if(priceFields.includes(name as string)){
      // Fixed: Use B2B field values instead of B2C values
      const basePriceB2B = value.base_price_b2b || 0;
      const taxPercentB2B = value.tax_b2b || 0;
      const profitPriceB2B = value.profit_price_b2b || 0;
      const shippingB2B = value.shipping_b2b || 0;
      const discountPercentB2B = value.discount_b2b || 0;
      
      const subtotal = basePriceB2B + profitPriceB2B + shippingB2B;
      const taxAmount = (subtotal * taxPercentB2B) / 100;
      const totalBeforeDiscount = subtotal + taxAmount;
      const discountAmount = (totalBeforeDiscount * discountPercentB2B) / 100;
      const total = totalBeforeDiscount - discountAmount;
      
      form.setValue('b2b_price', Math.max(0, total));
    }
  });
  return () => subscription.unsubscribe();
}, [form]);

  // Calculate total quantity
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      const packageFields = ['units_per_package', 'packages_recieved'];
      
      if (packageFields.includes(name as string)) {
        const unitsPerPackage = value.units_per_package || 0;
        const packagesReceived = value.packages_recieved || 0;
        const totalQuantity = unitsPerPackage * packagesReceived;
        form.setValue('quantity', Math.max(0, totalQuantity));
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);


  const selectedCategoryId = form.watch('category_id');

  const { data, isLoading, error } = useQuery<{categories: Categories[]; subcategories: Subcategories[]}>({
    queryKey: ["categories-subcategories"],
    queryFn: fetchCategoryAndSubcategory,
  });

  const filteredSubcategories = data?.subcategories.filter(
    (sub) => String(sub.category_id) === String(selectedCategoryId),
  ) || [];

  useEffect(() => {
    form.setValue('subcategory_id', '');
  }, [selectedCategoryId, form]);

  useEffect(() => {
    async function loadVendors() {
      try {
        const vendorData = await fetchVendors();
        setVendor(vendorData);
      } catch (error) {
        console.error('Failed to fetch vendor data:', error);
        toast.error('Failed to load vendors');
      }
    }
    loadVendors();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <AiOutlineLoading3Quarters className="animate-spin text-2xl text-amber-600" />
      <span className="ml-2">Loading Categories...</span>
    </div>
  );
  
  if (error || !data) return (
    <div className="p-4 text-red-600 bg-red-50 rounded-lg">
      Failed to fetch categories. Please try again.
    </div>
  );

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
          styledToast.success("Product added successfully!");
          form.reset();
          onSuccess?.();
          setImageUrls([]);
        }
      } catch (error: any) {
        toast.error("Failed to create product", {
          description: error.message,
        });
      }
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => router.push("/admin/products")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Products</span>
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Product</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Details */}
              <h2 className="flex items-center text-xl font-semibold mb-4">Product Details{line}</h2>

              {/* Product Image */}
              <div className="mb-4">
                <UploadImageButton imageUrls={imageUrls} setImageUrls={setImageUrls} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU-Code */}
                <FormField
                  control={form.control}
                  name="sku_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SKU-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="product-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subcategory */}
                <FormField
                  control={form.control}
                  name="subcategory_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedCategoryId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredSubcategories.map((sub: Subcategories) => (
                              <SelectItem key={sub.subcategory_id} value={String(sub.subcategory_id)}>
                                {sub.subcategory_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

          {/* Vendor Details */}
              <h2 className="flex items-center text-xl font-semibold mb-4">Vendor Details{line}</h2>
              <div className="space-y-4">
                <VendorForm />
                <FormField
                  control={form.control}
                  name="vendor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vendor" />
                          </SelectTrigger>
                          <SelectContent>
                            {vendor.map((v) => (
                              <SelectItem key={v.vendor_id} value={String(v.vendor_id)}>
                                {v.vendor_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

          {/* Price Management */}
              <h2 className="flex items-center text-xl font-semibold mb-4">Price Management{line}</h2>
              <p className="font-semibold">B2C (Buyer to Customer)</p>
              {/* Price Management for B2C */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="base_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profit_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profit ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700">Total Price:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ${(form.watch('total_price') || 0).toFixed(2)}
                  </span>
                </div>
              </div>


              {/* Price Management for B2B  */}
              <p className="font-semibold">B2B (Buyer to Buyer)</p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="base_price_b2b"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profit_price_b2b"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profit ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_b2b"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_b2b"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_b2b"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-700">Total Price:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ${(form.watch('b2b_price') || 0).toFixed(2)}
                  </span>
                </div>
              </div>

          {/* Stock Details */}
              <h2 className="flex items-center text-xl font-semibold mb-4">Stock Details{line}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="base_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., kg, pcs, liter" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Warehouse A, Shelf 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="package_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Type</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="case">Case</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_stock_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Stock Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_stock_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Stock Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="default_shelf_life_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shelf Life (Days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 7)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

          {/* First Batch Details */}
              <h2 className="flex items-center text-xl font-semibold mb-4">First Batch Details{line}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="batch_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number</FormLabel>
                      <FormControl>
                        <Input placeholder="BATCH-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufacture_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacture Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                            fromYear={2000}
                            toYear={2030}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recieved_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Received Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                            fromYear={2000}
                            toYear={2030}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                            fromYear={2000}
                            toYear={2030}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="units_per_package"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units Per Package</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packages_recieved"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Packages Received</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled
                          className="bg-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about this batch..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

          <div className="flex w-full gap-2">
            <Button
            onClick={() => router.push("/admin/products")}
            className="w-1/2">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} 
            className="w-1/2 bg-orange-100 border border-amber-500 text-amber-700">
            {isPending ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2"/>
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
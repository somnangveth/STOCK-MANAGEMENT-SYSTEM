"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { addMultipleDiscounts } from "@/app/functions/admin/price/price";
import { Price } from "@/type/productType";
import { styledToast } from "@/app/components/Toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  data: z.array(z.object({
    discount_percent: z.number().min(0, "Must be greater than or equal to 0").max(100, "Cannot exceed 100%"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    discount_price: z.number().min(0, "Must be greater than or equal to 0"),
  })).min(1, "At least one discount is required")
});

type FormValues = z.infer<typeof FormSchema>;

export default function DiscountMultiple({ price }: { price: Price }) {
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      data: [{
        discount_percent: 0,
        start_date: "",
        end_date: "",
        discount_price: 0,
      }],
    }
  });

  // Debug: Check if price_id exists
  console.log("Price object:", price);
  console.log("Price ID:", price?.price_id);

  // Auto Calculating discount price based on percentage
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('data.') && name.includes('.discount_percent')) {
        const match = name.match(/data\.(\d+)\.discount_percent/);
        if (match) {
          const index = parseInt(match[1]);
          const discountPercent = value.data?.[index]?.discount_percent;
          
          if (discountPercent !== undefined && price.total_price) {
            const discountAmount = (price.total_price * discountPercent) / 100;
            const discountedPrice = price.total_price - discountAmount;
            form.setValue(`data.${index}.discount_price` as const, parseFloat(discountedPrice.toFixed(2)));
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, price.total_price]);

  const onSubmit = (formData: FormValues) => {
    // Validate price_id before submitting
    if (!price?.price_id) {
      styledToast.error("Price ID is missing. Cannot add discount.");
      console.error("Price object missing price_id:", price);
      return;
    }

    startTransition(async () => {
      try {
        console.log("Submitting with price_id:", price.price_id);
        
        // Convert string dates to Date objects before sending
        const dataWithDates = formData.data.map(item => ({
          ...item,
          start_date: new Date(item.start_date),
          end_date: new Date(item.end_date),
        }));

        const result = await addMultipleDiscounts(price.price_id, dataWithDates);
        
        if (!result) {
          console.error("Failed to add discount");
          styledToast.error("Failed to add discount!");
          return;
        }
        
        styledToast.success("Add Discount Successfully!");
        document.getElementById('add-discount')?.click();
        window.location.reload();
      } catch (error) {
        console.error("Error adding discount:", error);
        styledToast.error("An error occurred!");
      }
    });
  };

  const addDiscount = () => {
    const currentData = form.getValues('data');
    form.setValue('data', [
      ...currentData,
      {
        discount_percent: 0,
        start_date: "",
        end_date: "",
        discount_price: 0,
      }
    ]);
  };

  const removeDiscount = (index: number) => {
    const currentData = form.getValues('data');
    if (currentData.length > 1) {
      form.setValue('data', currentData.filter((_, i) => i !== index));
    }
  };

  // Show error if price_id is missing
  if (!price?.price_id) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: Price information is incomplete. Cannot add discount.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {form.watch('data').map((_, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 relative">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Discount #{index + 1}</h4>
                {form.watch('data').length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDiscount(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`data.${index}.discount_percent`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percent (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter discount percentage"
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
                name={`data.${index}.discount_price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounted Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Auto-calculated"
                        {...field}
                        readOnly
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`data.${index}.start_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`data.${index}.end_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addDiscount}
            className="w-full"
          >
            + Add Another Discount
          </Button>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? "Submitting..." : "Submit Discounts"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
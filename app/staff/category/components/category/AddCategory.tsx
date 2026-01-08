"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { addCategoryStaff } from "@/app/functions/staff/stock/category/category";
import { styledToast } from "@/app/components/Toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { btnStyle } from "@/app/components/ui";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
    category_name: z.string(),
    slug: z.string(),
});

export default function AddCategoryStaff(){
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            category_name: "",
            slug: ""
        }
    });

    function onSubmit(data: z.infer<typeof FormSchema>){
        startTransition(async() => {
            try{
                const result = await addCategoryStaff(data);

                if(!result){
                    console.error("Failed to create category");
                    styledToast.error("Failed to create category");
                }

                styledToast.success("Create category successfully!");
                document.getElementById("create-category")?.click();
                form.reset();
                window.location.reload();
            }catch(error){
                styledToast.error("An error occured!");
                throw error;
            }
        })
    }

    return(
    <Form {...form}>
      <form
      onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">

        <FormField
          control={form.control}
          name="category_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <input
                  type="text"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <input
                  type="text"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className={btnStyle}
        >
          {isPending ? (
            <AiOutlineLoading3Quarters className={cn("animate-spin")} />
          ) : (
            "Create Category"
          )}
        </button>
      </div>
      </form>
    </Form>
    )
}
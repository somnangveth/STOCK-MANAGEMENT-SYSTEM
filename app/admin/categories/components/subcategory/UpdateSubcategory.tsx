"use client";

import { Form } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { Categories, Subcategories } from "@/type/productType";
import { useQuery } from "@tanstack/react-query";


//Update Schema 
const UpdateSchema = z.object({
    category_id: z.string().optional(),
    subcategory_name: z.string().optional(),
});

export default function UpdateSubcategory({subcategory}:{subcategory: Subcategories}){
    const [category, setCategory] = useState<Categories[]>();

    //Fetching Category
    async function fetchCategoryAndSubcategory(){
        const res = await fetch('/api/admin/fetchCategoryaAndSubcategory');
        if(!res.ok){
            console.error("Failed to fetch category and subcategory data");
            throw new Error("Failed to fetch");
        }

        return res.json();
    }

    const {data, isLoading, error} = useQuery({
        queryKey: ["category-subcategory"],
        queryFn: fetchCategoryAndSubcategory,
    });


    //Form
    const form = useForm<z.infer<typeof UpdateSchema>>({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            category_id: '',
            subcategory_name: "",
        }
    })
    return(
        <Form {...form}>
            <div>

            </div>
        </Form>
    )
}
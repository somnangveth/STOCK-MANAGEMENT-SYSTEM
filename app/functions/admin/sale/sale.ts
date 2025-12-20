"use server";

import { createSupabaseAdmin} from "@/lib/supbase/action";

type AddSalesData = {
    customer_name: string;
    contact_info: string;
    customertype: "General" | "Dealer";
    payment_method: "cash" | "card" | "bank-transfer";
    payment_status: "pending" | "paid" | "partial" | "refunded";
    note: string;
    discount: number;
    tax: number;
    subtotal: number;
    total: number;
    cart_items: Array<{
        product_id: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
    }>;
};

export async function addSales(data: AddSalesData) {
    const supabase = await createSupabaseAdmin();
    
    try {
        // Validate required fields
        if (!data.cart_items || !Array.isArray(data.cart_items) || data.cart_items.length === 0) {
            throw new Error("Cart items are required and must not be empty");
        }

        if (!data.customer_name || !data.contact_info) {
            throw new Error("Customer name and contact info are required");
        }

        console.log("=== ADD SALES DEBUG ===");
        console.log("Input data:", JSON.stringify(data, null, 2));

        // Step 1: Insert into sale table FIRST to get the sale_id
        const saleDataToInsert = {
            customer_name: data.customer_name,
            customer_contact: data.contact_info,
            subtotal: Math.round(data.subtotal * 100) / 100, // Round to 2 decimals
            tax_amount: Math.round(data.tax * 100) / 100,
            discount_amount: Math.round(data.discount * 100) / 100,
            total_amount: Math.round(data.total * 100) / 100,
            payment_method: data.payment_method,
            payment_status: data.payment_status,
            note: data.note || "",
            customertype: data.customertype,
        };

        console.log("Sale data to insert:", JSON.stringify(saleDataToInsert, null, 2));
        console.log("Data types:", {
            subtotal: typeof saleDataToInsert.subtotal,
            tax_amount: typeof saleDataToInsert.tax_amount,
            discount_amount: typeof saleDataToInsert.discount_amount,
            total_amount: typeof saleDataToInsert.total_amount,
        });

        const { data: saleData, error: saleError } = await supabase
            .from("sale")
            .insert(saleDataToInsert)
            .select()
            .single();

        if (saleError) {
            console.error("Failed to insert sale data:", saleError);
            throw new Error(`Error inserting sale: ${saleError.message}`);
        }

        // Step 2: Get the generated sale_id
        const saleId = saleData.sale_id;

        // Step 3: Prepare sale items with the sale_id
        const saleItemsToInsert = data.cart_items.map(item => ({
            sale_id: saleId,
            product_id: item.product_id,
            quantity: parseInt(item.quantity.toString()),
            unit_price: parseFloat(item.unit_price.toFixed(2)),
            discount: 0, // You can calculate per-item discount if needed
            tax: 0, // You can calculate per-item tax if needed
            subtotal: parseFloat(item.subtotal.toFixed(2)),
            total: parseFloat(item.subtotal.toFixed(2)), // Adjust if you have per-item discount/tax
        }));

        console.log("Sale items to insert:", JSON.stringify(saleItemsToInsert, null, 2));

        // Step 4: Insert into sale_items table
        const { data: saleItemsData, error: saleItemsError } = await supabase
            .from("sale_items")
            .insert(saleItemsToInsert)
            .select();

        if (saleItemsError) {
            console.error("Failed to insert sale items:", saleItemsError);
            // Attempt to rollback by deleting the sale record
            await supabase.from("sale").delete().eq("sale_id", saleId);
            throw new Error(`Error inserting sale items: ${saleItemsError.message}`);
        }

        return {
            success: true,
            sale: saleData,
            saleItems: saleItemsData,
        };

    } catch (error) {
        console.error("Failed to process sale:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";

export async function addPrice(data: {
  product_id: string;
  base_price: number;
  tax: number;
  final_price: number;
  profit_price: number;
  shipping: number;
  discount: number;
}) {
  const supabase = await createSupabaseAdmin();

  try {
    console.log("Price Insert Payload:", data);

    const { data: priceData, error } = await supabase
      .from("prices")
      .insert({
        product_id: data.product_id,
        base_price: data.base_price,
        tax: data.tax,
        final_price: data.final_price,
        profit_price: data.profit_price,
        shipping: data.shipping,
        discount: data.discount,
      })
      .select("*");

    if (error) {
      console.error("❌ Supabase Insert Error:", error);

      // Important: return the REAL supabase message to frontend
      throw new Error(error.message);
    }

    console.log("✅ Price Inserted:", priceData);

    return { success: true, price: priceData };
  } catch (err: any) {
    console.error("🔥 Insert Price Failed:", err.message);
    throw new Error(err.message || "Failed to insert price");
  }
}

//Update Product Price for B2C
export async function updatePriceB2C(
  price_id: string,
  data: Partial<{
    base_price: number;
    tax: number;
    total: number;
    profit_price: number;
    shipping: number;
    discount: number;
  }>
){
  const supabase = await createSupabaseAdmin();

  try{
    console.log("Updating Price...");

    const {data: priceData, error: priceError} = await supabase
    .from("prices")
    .update({
      base_price: data.base_price,
      tax: data.tax,
      final_price: data.total,
      profit_price: data.profit_price,
      shipping: data.shipping,
      discount: data.discount,
    })
    .eq("price_id", price_id);

    if(priceError){
      console.error("Failed to fetch price data", priceError);
      throw new Error("Error fetching");
    }

    return priceData;
     
  }catch(error){
    console.error("Failed to fetch: ", error);
  }
}

  //Update Product Price for B2B
  export async function updatePriceB2B(
  price_id: string,
  data: Partial<{
    base_price: number;
    tax_amount: number;
    b2b_price: number;
    profit_price: number;
    shipping: number;
    discount_amount: number;
  }>
  ){
  const supabase = await createSupabaseAdmin();

  try{
    console.log("Updating Price...");

    const {data: priceData, error: priceError} = await supabase
    .from("prices")
    .update({
      base_price: data.base_price,
      tax_amount: data.tax_amount,
      b2b_price: data.b2b_price,
      profit_price: data.profit_price,
      shipping: data.shipping,
      discount_amount: data.discount_amount,
    })
    .eq("price_id", price_id);

    if(priceError){
      console.error("Failed to fetch price data", priceError);
      throw new Error("Error fetching");
    }

    return priceData;
      
  }catch(error){
    console.error("Failed to fetch: ", error);
  }
  }

//Update Multiple Price
export async function updateMultiplePrices(
  product_id: string,
  data: Array<Partial<{
    base_price: number;
    tax: number;
    final_price: number;
    profit_price: number;
    shipping: number;
    discount: number;
  }>>
){
  const supabase = await createSupabaseAdmin();

  try{

    if(!Array.isArray(data)){
      return null;
    }

    //Records of prices
    const priceRecord = data.map(item => ({
      base_price: item.base_price,
      tax: item.tax,
      final_price: item.final_price,
      profit_price: item.profit_price,
      shipping: item.shipping,
      discount: item.discount,
    }));


    const {data: priceData, error: priceError} = await supabase
    .from('prices')
    .update(priceRecord)
    .eq('product_id', product_id);

    if(priceError){
      console.error("Failed to update multiple prices");
    }

    return {priceData};
    
  }catch(error){
    console.error(error);
  }
}

// Add Multiple Discounts to Products
export async function addMultipleDiscounts(
  price_id: string,
  data: Array<{
    discount_percent: number;
    start_date: Date;
    end_date: Date;
    discount_price: number;
  }>
) {
  const supabase = await createSupabaseAdmin();
  
  try {
    // Validate price_id
    if (!price_id || price_id === 'undefined') {
      throw new Error("Invalid price_id provided");
    }

    console.log("Adding discounts for price_id:", price_id);

    const discountRecord = data.map(item => ({
      discount_percent: item.discount_percent,
      start_date: item.start_date,
      end_date: item.end_date,
      discount_price: item.discount_price,
    }));

    // Add data into discount table
    const { data: discountData, error: discountError } = await supabase
      .from("discount")
      .insert(discountRecord)
      .select('discount_id');

    if (discountError) {
      console.error("Failed to insert into discount table:", discountError.message);
      throw discountError;
    }

    if (!discountData || discountData.length === 0) {
      throw new Error("No discount IDs returned from insert");
    }

    console.log("Discount data inserted:", discountData);

    // Extract the first discount_id
    const discountId = discountData[0].discount_id;

    // Update price table with the discount_id
    const { data: priceData, error: priceError } = await supabase
      .from("prices")
      .update({ discount_id: discountId })
      .eq('price_id', price_id)
      .select();

    if (priceError) {
      console.error("Failed to update price table:", priceError.message);
      throw priceError;
    }

    console.log("Price table updated:", priceData);

    return { discountData, priceData };
    
  } catch (error) {
    console.error("Error adding discounts:", error);
    throw error;
  }
}


//Fetch Price for B2C (Buyer to Customer)
export async function fetchPricesB2C(){
  const supabase = await createSupabaseAdmin();

  const {data: priceData, error: priceError} = await supabase
  .from("prices")
  .select("*")
  .not('total_price','is', null);

  if(priceError){
    console.error("Failed to fetch price data for B2C");
    throw new Error("Error fetching...");
  }

  return priceData;
}

//Fetch Price for B2B(Buyer to Buyer)
export async function fetchPricesB2B(){
  const supabase = await createSupabaseAdmin();

  const {data: priceData, error: priceError} = await supabase
  .from("prices")
  .select("*")
  .not('b2b_price', 'is',null);

  if(priceError){
    console.error("Failed to fetch Price Data for B2B");
    throw new Error("Error fetching...");
  }
  return priceData;
}
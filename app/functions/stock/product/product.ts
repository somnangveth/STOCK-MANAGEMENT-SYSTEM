"use server";
import { getLoggedInUser } from "@/app/auth/actions";
import { createSupabaseAdmin } from "@/lib/supbase/action";
import { Product } from "@/type/productType";

// Create new Product
export async function createProduct(data: {
  // Products Info
  sku_code: string;
  product_name: string;
  slug: string;
  category_id: string;
  subcategory_id: string;
  vendor_id: string;
  description: string;
  product_image?: string;
  min_stock_level: number;
  max_stock_level: number;
  default_shelf_life_days: number;
  base_unit: string;
  units_per_package: number;
  package_type: "box" | "case";

  // Product Batches
  batch_number: string;
  manufacture_date: Date;
  expiry_date: Date;
  cost_price: number;
  recieved_date: Date;
  note: string;
  quantity: number;
  packages_recieved: number;
}) {
  const supabase = await createSupabaseAdmin();
  const getUser = await getLoggedInUser();

  const createdBy = getUser?.id;

  // -----------------------------
  // Insert Product
  // -----------------------------
  const { data: productData, error: productError } = await supabase
    .from("products")
    .insert({
      sku_code: data.sku_code,
      product_name: data.product_name,
      slug: data.slug,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      vendor_id: data.vendor_id,
      description: data.description,
      product_image: data.product_image,
      min_stock_level: data.min_stock_level,
      max_stock_level: data.max_stock_level,
      default_shelf_life_days: data.default_shelf_life_days,
      base_unit: data.base_unit,
      units_per_package: data.units_per_package,
      package_type: data.package_type,
      created_by: createdBy,
    })
    .select()
    .single();

  if (productError) {
    console.error("Failed to insert product:", productError);
    throw new Error(productError.message);
  }

  const productId = productData?.product_id;

  if (!productId) {
    throw new Error("No product ID returned from product insert.");
  }

  // -----------------------------
  // Insert First Product Batch
  // -----------------------------
  const { data: batchData, error: batchError } = await supabase
    .from("product_batches")
    .insert({
      product_id: productId,
      batch_number: data.batch_number, // <-- FIXED
      manufacture_date: data.manufacture_date,
      expiry_date: data.expiry_date,
      cost_price: data.cost_price,
      vendor_id: data.vendor_id,
      recieved_date: data.recieved_date,
      note: data.note,
      created_by: createdBy,
      quantity: data.quantity,
      quantity_remaining: data.quantity,
      packages_recieved: data.packages_recieved,
      units_per_package: data.units_per_package,
    })
    .select()
    .single();

  if (batchError) {
    console.error("Failed to insert product batch:", batchError);
    throw new Error(batchError.message);
  }

  return { productData, batchData };
}



// Update Product data
export async function updateProduct(
  product_id: string,
  data: Partial<{
    sku_code: string | null;
    product_name: string | null;
    slug: string | null;
    category_id: string | null;
    subcategory_id: string | null;
    vendor_id: string | null;
    description: string | null;
    product_image: string | null;
    min_stock_level: number | null;
    max_stock_level: number | null;
    default_shelf_life_days: number | null;
    base_unit: string | null;
    units_per_package: number | null;
    package_type: 'box' | 'case' | null;
  }>
) {
  const supabase = await createSupabaseAdmin();

  try {
    // Convert undefined or "" values to null
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (value === undefined || value === "") return [key, null];
        return [key, value];
      })
    );

    const { data: productData, error: productError } = await supabase
      .from('products')
      .update(sanitizedData)
      .eq('product_id', product_id)
      .single();

    if (productError) {
      console.error("Supabase update error:", productError);
      throw new Error("Failed to update product");
    }

    return productData;

  } catch (error: any) {
    console.error("updateProduct() Exception:", error);
    throw new Error("Failed to update product data: " + error.message);
  }
}

//Delete a Product
export async function deleteProduct({product}:{product: Product}){
  const supabase = await createSupabaseAdmin();

  try{
    const {data: productData, error: productError} = await supabase
    .from('products')
    .delete()
    .eq('product_id', product.product_id)
    .single();

    if(productError){
      console.error('Failed to delete product data', productError);
    }

    return JSON.stringify({success: true}, productData);
  }catch(error: any){
    throw new Error('Failed to delete Product', error);
  }
}



//Fetch All Products
export async function fetchProducts() {
  const supabase = await createSupabaseAdmin();

  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("*");

  if (productError) {
    console.error("Supabase query error:", productError); 
    console.error("Hint: check table name, column names, and RLS policies.");
    throw new Error(`Failed to fetch product data: ${productError.message}`);
  }

  return productData;
}

//Fetch All Categoies And Subcategories
export async function fetchCategoriesAndSubcategories(){
  const supabase = await createSupabaseAdmin();

  // Fetch all Categories
  const {data: categories, error: categoryError} = await supabase
  .from('category')
  .select('*');

  if(categoryError){
    throw new Error('Failed to fetch Category Data', categoryError);
  }

  //Fetch All Subcategories
  const{data: subcategories, error: subcategoryError} = await supabase
  .from('subcategory')
  .select('*');

  if(subcategoryError){
    throw new Error('Failed to fetch Subcategory', subcategoryError);
  }

  return {categories, subcategories};
}

//Fetch Vendors
export async function fetchVendors(){
  const supabase = await createSupabaseAdmin();

  const {data: vendorData, error: vendorError} = await supabase
  .from('vendors')
  .select('*');

  if(vendorError){
    throw new Error('Failed to fetch Vendor Data', vendorError);
  }

  return vendorData;
}
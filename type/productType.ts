//vendortype
export type Vendors = {
    vendor_id: string,
    vendor_name: string,
    contact_person: string,
    phone_number1: string,
    phone_number2: string,
    vendor_email: string,
    vendor_image: string,
    source_link: string,
    vendortype: string,
    address: string,
    city: string,
    country: string,
    payment_terms: string,
    notes: string
}

// productType.ts

// Base Product Type (matches your API response)
export type Product = {
  product_id: string;
  sku_code: string;
  product_name: string;            
  product_image: string;                  
  description: string;
  slug: string;
  category_id: number;
  subcategory_id: number;
  vendor_id: number;
  min_stock_level: number;
  max_stock_level: number;
  default_shelf_life_days: number;
  base_unit: string;
  units_per_package: number;
  package_type: 'box' | 'case';
  track_expiry: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;

  total_price: number;
  discount_price: number;
  tax_amount: number;

  //Expiry
  manufacture_date?: string;
  expiry_date?: string;
  received_date?: string;
  quantity_remaining?: number;
};

export type Price = {
  price_id: string;
  product_id: string;
  base_price: number;
  profit_price: number;
  tax: number;
  shipping: number;
  discount: number;
  total_price: number;
  b2b_price: number | null;
  created_at: string;
};

export type Sale = {
  sale_id: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  process_status: string;
  payment_method: string;
  created_at: string;
  status: string;
  customertype: "Dealer" | "General";
}

// Batch fields (if you need them separately)
export type ProductBatch = {
  batch_number: string;
  manufacture_date: Date;
  expiry_date: Date;
  cost_price: number;
  received_date: Date;
  note?: string;
  quantity: number;
  quantity_remaining: number;
  packages_received: number;
};

// Product Association Type (matches your association API)
export type ProductAssociation = {
  association_id: string;
  product_id: string;
  associated_product_id: string;
  association_type: 'related' | 'bundle' | 'alternative';
  created_at: string;
};
//Category Type
export type Categories = {
  category_id: string;
  category_name: string;
  slug: string;
}

//Subcategory Type
export type Subcategories = {
  subcategory_id: string;
  subcategory_name: string;
  category_id: string;
}
//Stock Type
export type Stock = {
  id?: string;
  stock_name?: string;
  stock_total?: number;
}

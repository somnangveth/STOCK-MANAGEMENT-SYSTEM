//vendortype
export type Vendors = {
    vendor_id: number,
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
  [x: string]: number;
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
// types/purchase.ts

export type PurchaseStatus = "draft" | "submitted" | "confirmed" | "received" | "completed" | "cancelled";

export type PurchaseItem = {
  purchase_item_id: string;
  product_id: string;
  product_name: string;
  sku_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  expiry_date?: string;
  batch_number?: string;
  warehouse_location?: string;
  received_quantity: number;
  batch_id?: string;
  product_image?: string;
};

export type PurchaseOrderDetail = {
  purchase_id: string;
  po_number: string;
  vendor_id: number;
  vendor_name: string;
  purchase_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  payment_terms?: string;
  note?: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  status: PurchaseStatus;
  created_at?: string;
  updated_at?: string;
  purchase_items: PurchaseItem[];
  vendor_image?: string;
};

export type PurchaseOrder = {
  [x: string]: any;
  purchase_id: string;
  po_number: string;
  vendor_id: number;
  vendor_name: string;
  total_amount: number;
  status: PurchaseStatus;
  purchase_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  item_count: number;
  received_items_count: number;
  items?: PurchaseItem[];
};

export type CreatePurchaseOrderInput = {
  vendor_id: number;
  purchase_date: string;
  expected_delivery_date?: string;
  payment_terms: string;
  PurchaseStatus: PurchaseStatus;
  note: string;
  subtotal: number;
  tax: number;
  total_amount: number;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    expiry_date?: string;
    batch_number?: string;
    warehouse_location?: string;
  }>;
};

export type UpdatePurchaseOrderInput = {
  
  expected_delivery_date?: string;
  payment_terms?: string;
  PurchaseStatus?: PurchaseStatus;
  note?: string;
};

export type ServerResponse<T> = {
  data: T | null;
  error: string | null;
};

export type POReceiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poNumber: string;
  items: PurchaseItem[];
  onReceive: (receivedData: Record<string, number>) => Promise<void>;
  isLoading?: boolean;
}
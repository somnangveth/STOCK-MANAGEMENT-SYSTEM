//vendortype
export type Vendors = {
    vendor_id: string;
    vendor_name: string;
    phone_number1: string;
    phone_number2: string;
    vendor_email: string;
    vendor_location: string;
    vendor_image: string;
    vendortype: 'local' | 'non-local';
    source_link: string;
}

// productType
export type Product = {
  product_id: string;
  sku_code?: string;
  product_name?: string;            
  product_image?: string;                  
  description: string;
  slug: string;
  category_id: string;
  subcategory_id: string;
  vendor_id: string;
  min_stock_level: number;
  max_stock_level: number;
  default_shelf_life_days: number;
  base_unit: string;
  units_per_package: number;
  package_type: 'box' | 'case';

  //Batch
  batch_number?: string;
  manufacture_date?: Date;
  expiry_date?:Date;
  cost_price?: number;
  recieved_date?: Date;
  note?: string;
  quantity?: number;
  quantity_remaining?: number;
  packages_recieved?: number;
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

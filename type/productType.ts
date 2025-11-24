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
  id?: number | string;
  name?: string;            
  image?: string;                  
  description?: string;            
  category?: string;
  subcategory?: string;
  baseprice?: number;
  taxes?: number;
  totalprice?: number;
  quantity?: number;
  date?: string;
};

//Stock Type
export type Stock = {
  id?: string;
  stock_name?: string;
  stock_total?: number;
}

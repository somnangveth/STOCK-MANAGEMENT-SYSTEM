export interface SaleItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Sale {
  sale_id: string;
  sales_number: string;
  sale_date: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  payment_method?: string;
  payment_status?: string;
  process_status?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  note?: string;
  items: SaleItem[]; // ⚡ items 里包含 product_name
}

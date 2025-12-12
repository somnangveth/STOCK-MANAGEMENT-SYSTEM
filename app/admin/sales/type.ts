// app/admin/sales/type.ts
import { z } from "zod";

// 原有的 Sale 类型定义保持不变
export interface Sale {
  sale_id: string;
  sales_number: string;
  sale_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_method: string;
  payment_status: "pending" | "paid" | "partial" | "refunded";
  process_status: "draft" | "completed" | "cancelled";
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  items: SaleItem[];
  note: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// ==================== 新增部分 ====================

// Zod Schema 导出版本
export const saleSchema = z.object({
  sales_number: z.string().optional().nullable(),
  sale_date: z.string().optional().nullable(),
  customer_name: z.string().optional().nullable(),
  customer_email: z.string().email().optional().nullable(),
  customer_phone: z.string().optional().nullable(),
  subtotal: z.coerce.number().int().min(0).default(0),
  tax_amount: z.coerce.number().int().min(0).default(0),
  discount_amount: z.coerce.number().int().min(0).default(0),
  total_amount: z.coerce.number().int().min(0).default(0),
  payment_method: z.string().optional().nullable(),
  payment_status: z.enum(["pending", "paid", "partial", "refunded"]).default("pending"),
  process_status: z.enum(["draft", "completed", "cancelled"]).default("draft"),
  note: z.string().optional().nullable(),
});

// TypeScript 类型推断
export type SaleInput = z.infer<typeof saleSchema>;

// 金额格式化工具函数
export function formatCentsToDollars(cents: number | null | undefined): string {
  if (cents === null || cents === undefined || isNaN(cents)) return "0.00";
  return (cents / 100).toFixed(2);
}

export function formatDollarsToCents(dollars: string | number): number {
  if (!dollars) return 0;
  const num = typeof dollars === 'string' ? parseFloat(dollars) : dollars;
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}
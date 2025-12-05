"use client";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ReactNode } from "react";

// 1️. Allowed table columns
type ColumnKey =
  | "sku-code"
  | "product_image"
  | "product_name"
  | "category_id"
  | "base_unit"
  | "baseprice"
  | "taxes"
  | "totalprice"
  | "quantity"
  | "date"
  | "description"
  | "action";

// 2️. Product type
type Product = {
  sku_code?: number | string;
  product_image?: string;
  product_name?: string;
  category_id?: string;
  base_unit?: string;
  baseprice?: number;
  taxes?: number;
  totalprice?: number;
  quantity?: number;
  date?: string;
  description?: string;
};

// 3️. Component props type
interface ProductTableProps {
  products: Product[];
  columns: ColumnKey[];
  form?: ReactNode | ((product: Product) => ReactNode);
}

// 4️. Table component
export default function ProductTable({ products, columns, form }: ProductTableProps) {
  return (
    <Table className="w-full border border-gray-300 rounded-xl">
      <TableHeader className="bg-gray-100">
        <TableRow>
          {columns.includes("sku-code") && <TableHead>ID</TableHead>}
          {columns.includes("product_image") && <TableHead>Image</TableHead>}
          {columns.includes("product_name") && <TableHead>Name</TableHead>}
          {columns.includes("category_id") && <TableHead>Category</TableHead>}
          {columns.includes("base_unit") && <TableHead>Unit</TableHead>}
          {columns.includes("baseprice") && <TableHead>Base Price</TableHead>}
          {columns.includes("taxes") && <TableHead>Taxes</TableHead>}
          {columns.includes("totalprice") && <TableHead>Total Price</TableHead>}
          {columns.includes("quantity") && <TableHead>Qty</TableHead>}
          {columns.includes("date") && <TableHead>Date</TableHead>}
          {columns.includes("description") && <TableHead>Description</TableHead>}
          {columns.includes("action") && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={product.sku_code || index}>
            {columns.includes("sku-code") && <TableCell>{product.sku_code}</TableCell>}
            {columns.includes("product_image") && (
              <TableCell>
                {product.product_image ? (
                  <img src={product.product_image} alt={product.product_name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  "—"
                )}
              </TableCell>
            )}
            {columns.includes("product_name") && <TableCell>{product.product_name || "—"}</TableCell>}
            {columns.includes("category_id") && <TableCell>{product.category_id || "—"}</TableCell>}
            {columns.includes("base_unit") && <TableCell>{product.base_unit || "—"}</TableCell>}
            {columns.includes("baseprice") && <TableCell>{product.baseprice ?? "—"}</TableCell>}
            {columns.includes("taxes") && <TableCell>{product.taxes ?? "—"}</TableCell>}
            {columns.includes("totalprice") && <TableCell>{product.totalprice ?? "—"}</TableCell>}
            {columns.includes("quantity") && <TableCell>{product.quantity ?? "—"}</TableCell>}
            {columns.includes("date") && <TableCell>{product.date || "—"}</TableCell>}
            {columns.includes("description") && <TableCell>{product.description || "—"}</TableCell>}
            {columns.includes("action") && (
              <TableCell>
                {typeof form === "function" ? form(product) : form}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
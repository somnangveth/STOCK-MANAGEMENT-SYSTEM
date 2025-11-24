"use client";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// 1️⃣ Allowed table columns
type ColumnKey =
  | "id"
  | "image"
  | "name"
  | "category"
  | "subcategory"
  | "baseprice"
  | "taxes"
  | "totalprice"
  | "quantity"
  | "date"
  | "description";

// 2️⃣ Product type
type Product = {
  id?: number | string;
  image?: string;
  name?: string;
  category?: string;
  subcategory?: string;
  baseprice?: number;
  taxes?: number;
  totalprice?: number;
  quantity?: number;
  date?: string;
  description?: string;
};

// 3️⃣ Component props type
interface ProductTableProps {
  product: Product;
  columns: ColumnKey[];
}

// 4️⃣ Table component
export default function ProductTable({ product, columns }: ProductTableProps) {
  return (
    <Table className="w-full border border-gray-300 rounded-xl">
      <TableHeader className="bg-gray-100">
        <TableRow>
          {columns.includes("id") && <TableHead>ID</TableHead>}
          {columns.includes("image") && <TableHead>Image</TableHead>}
          {columns.includes("name") && <TableHead>Name</TableHead>}
          {columns.includes("category") && <TableHead>Category</TableHead>}
          {columns.includes("subcategory") && <TableHead>Subcategory</TableHead>}
          {columns.includes("baseprice") && <TableHead>Base Price</TableHead>}
          {columns.includes("taxes") && <TableHead>Taxes</TableHead>}
          {columns.includes("totalprice") && <TableHead>Total Price</TableHead>}
          {columns.includes("quantity") && <TableHead>Qty</TableHead>}
          {columns.includes("date") && <TableHead>Date</TableHead>}
          {columns.includes("description") && <TableHead>Description</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          {columns.includes("id") && <TableCell>{product.id}</TableCell>}
          {columns.includes("image") && (
            <TableCell>
              {product.image ? (
                <img src={product.image} className="w-10 h-10 rounded-lg" />
              ) : (
                "—"
              )}
            </TableCell>
          )}
          {columns.includes("name") && <TableCell>{product.name}</TableCell>}
          {columns.includes("category") && <TableCell>{product.category}</TableCell>}
          {columns.includes("subcategory") && <TableCell>{product.subcategory}</TableCell>}
          {columns.includes("baseprice") && <TableCell>{product.baseprice}</TableCell>}
          {columns.includes("taxes") && <TableCell>{product.taxes}</TableCell>}
          {columns.includes("totalprice") && <TableCell>{product.totalprice}</TableCell>}
          {columns.includes("quantity") && <TableCell>{product.quantity}</TableCell>}
          {columns.includes("date") && <TableCell>{product.date}</TableCell>}
          {columns.includes("description") && <TableCell>{product.description}</TableCell>}
        </TableRow>
      </TableBody>
    </Table>
  );
}

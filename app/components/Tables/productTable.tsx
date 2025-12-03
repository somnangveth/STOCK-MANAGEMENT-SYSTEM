"use client";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useState } from "react";

// 1️. Allowed table columns
type ColumnKey =
  | "sku-code"
  | "product_image"
  | "product_name"
  | "category_id"
  | "subcategory_id"
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
  category_name?: string;
  subcategory_name?: string;
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
  product: Product[];
  columns: ColumnKey[];
  form?: ReactNode | ((product: Product) => ReactNode);
  itemsPerPage: number;
}

// 4️. Table component
export default function ProductTable({ product, columns, form, itemsPerPage}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

    if (!product || !Array.isArray(product)) {
    return <p>No products to display</p>;
  }

  const totalPages = Math.ceil(product.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = product.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev+1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev-1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };


  return (
<div className="space-y-4">
      <Table className="w-full border border-gray-300 rounded-xl">
      <TableHeader className="bg-gray-100">
        <TableRow>
          {columns.includes("sku-code") && <TableHead>ID</TableHead>}
          {columns.includes("product_image") && <TableHead>Image</TableHead>}
          {columns.includes("product_name") && <TableHead>Name</TableHead>}
          {columns.includes("category_id") && <TableHead className="text-center">Category</TableHead>}
          {columns.includes("subcategory_id") && <TableHead className="text-center">Subcategory</TableHead>}
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
      <TableBody className="bg-white">
        {product.map((products, index) => (
          <TableRow key={products.sku_code || index}>
            {columns.includes("sku-code") && <TableCell>{products.sku_code}</TableCell>}
            {columns.includes("product_image") && (
              <TableCell>
                {products.product_image ? (
                  <img src={products.product_image} alt={products.product_name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  "—"
                )}
              </TableCell>
            )}
            {columns.includes("product_name") && <TableCell className="">{products.product_name || "—"}</TableCell>}
            {columns.includes("category_id") && <TableCell className="text-center">{products.category_name || "—"}</TableCell>}
            {columns.includes("subcategory_id") && <TableCell className="text-center">{products.subcategory_name}</TableCell>}
            {columns.includes("base_unit") && <TableCell>{products.base_unit || "—"}</TableCell>}
            {columns.includes("baseprice") && <TableCell>{products.baseprice ?? "—"}</TableCell>}
            {columns.includes("taxes") && <TableCell>{products.taxes ?? "—"}</TableCell>}
            {columns.includes("totalprice") && <TableCell>{products.totalprice ?? "—"}</TableCell>}
            {columns.includes("quantity") && <TableCell>{products.quantity ?? "—"}</TableCell>}
            {columns.includes("date") && <TableCell>{products.date || "—"}</TableCell>}
            {columns.includes("description") && <TableCell>{products.description || "—"}</TableCell>}
            {columns.includes("action") && (
              <TableCell>
                {typeof form === "function" ? form(products) : form}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>


    {totalPages > 1 && (
      <div>
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, product.length)} of {product.length} products
        </div>


        <div className="flex items-center gap-2">
          <button
          onClick={goToPreviousPage}
          disabled = {currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 hover:gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1">
            {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
              <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === page
                ? "bg-blue-600 text-white"
                : "border border-gray-300 hover:bg-gray-100"
              }`}>
                {page}
              </button>
            ))}
          </div>

          <button
          onClick={goToNextPage}
          disabled= {currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
      </div>
    )}
</div>
  );
}
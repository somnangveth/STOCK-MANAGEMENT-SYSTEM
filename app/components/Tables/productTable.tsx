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

  //Expired Batch
  | "manufacture_date"
  | "expiry_date"
  | "recieved_date"
  | "quantity_remaining"

  //Sales
  | "sales_number"
  | "sales_date"
  | "customer_name"
  | "customer_email"
  | "customer_phone"
  | "subtotal"
  | "tax_amount"
  | "discount_amount"
  | "total_amount"
  | "payment_method"
  | "payment_status"
  | "process_status"
  | "note"
  | "created_at"

  //Action
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

  manufacture_date?: Date;
  expiry_date?: Date;
  received_date?: Date;
  quantity_remaining?: number;


  //Sales
  sales_number?: string;
  sales_date?: Date;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
  payment_method?: string;
  payment_status?: string;
  process_status?: string;
  note?: string;
  created_at?: string;
};

const formatDate = (value: string | Date | undefined) => {
  if(!value) return "-";
  const d = new Date(value);
  if(isNaN(d.getTime())) return "-";
  return d.toISOString().split('T')[0]; 
}

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

  if (product.length === 0) {
    return <p className="text-center p-4 text-gray-500">No products found matching your filters</p>;
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
        {/* Header */}
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

            {/* Expired Batch */}
            {columns.includes("manufacture_date") && <TableHead>Manufacture Date: </TableHead>}
            {columns.includes("recieved_date") && <TableHead>Recieved Date</TableHead>}
            {columns.includes("expiry_date") && <TableHead>Expiry Date: </TableHead>}
            {columns.includes("quantity_remaining") && <TableHead>In Stock</TableHead>}


            {/* Sales */}
            {columns.includes("sales_number") && <TableHead>Sales Number</TableHead>}
            {columns.includes("sales_date") && <TableHead>Sales Date</TableHead>}
            {columns.includes("customer_name") && <TableHead>Customer Name</TableHead>}
            {columns.includes("customer_email") && <TableHead>Customer Email</TableHead>}
            {columns.includes("customer_phone") && <TableHead>Customer Phone</TableHead>}
            {columns.includes("subtotal") && <TableHead>Subtotal</TableHead>}
            {columns.includes("tax_amount") && <TableHead>Tax Amount</TableHead>}
            {columns.includes("discount_amount") && <TableHead>Discount Amount</TableHead>}
            {columns.includes("total_amount") && <TableHead>Total Amount</TableHead>}
            {columns.includes("payment_method") && <TableHead>Payment Method</TableHead>}
            {columns.includes("payment_status") && <TableHead>Payment Status</TableHead>}
            {columns.includes("process_status") && <TableHead>Process Status</TableHead>}
            {columns.includes("note") && <TableHead>Note</TableHead>}
            {columns.includes("created_at") && <TableHead>Date: </TableHead>}

            {columns.includes("action") && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white">
          {currentProducts.map((products, index) => (
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
              {columns.includes("product_name") && <TableCell>{products.product_name || "—"}</TableCell>}
              {columns.includes("category_id") && <TableCell className="text-center"><p className="bg-amber-100 text-amber-700 rounded-lg">{products.category_name || "—"}</p></TableCell>}
              {columns.includes("subcategory_id") && <TableCell className="text-center"><p className="bg-purple-100 text-purple-700 rounded-lg">{products.subcategory_name || "—"}</p></TableCell>}
              {columns.includes("base_unit") && <TableCell>{products.base_unit || "—"}</TableCell>}
              {columns.includes("baseprice") && <TableCell>{products.baseprice ?? "—"}</TableCell>}
              {columns.includes("taxes") && <TableCell>{products.taxes ?? "—"}</TableCell>}
              {columns.includes("totalprice") && <TableCell>{products.totalprice ?? "—"}</TableCell>}
              {columns.includes("quantity") && <TableCell>{products.quantity ?? "—"}</TableCell>}
              {columns.includes("date") && <TableCell>{products.date || "—"}</TableCell>}
              {columns.includes("description") && <TableCell>{products.description || "—"}</TableCell>}

              {/* Expiry Products */}
            {columns.includes("manufacture_date") && <TableCell>{formatDate(products.manufacture_date)}</TableCell>}
            {columns.includes("recieved_date") && <TableCell>{formatDate(products.received_date)}</TableCell>}
            {columns.includes("expiry_date") && <TableCell>{formatDate(products.expiry_date)}</TableCell>}
            {columns.includes("quantity_remaining") && <TableCell>{products.quantity_remaining}</TableCell>}

                        {/* Sales */}
            {columns.includes("sales_number") && <TableCell>{products.sales_number}</TableCell>}
            {columns.includes("sales_date") && <TableCell>{formatDate(products.sales_date)}</TableCell>}
            {columns.includes("customer_name") && <TableCell>{products.customer_name}</TableCell>}
            {columns.includes("customer_email") && <TableCell>{products.customer_email}</TableCell>}
            {columns.includes("customer_phone") && <TableCell>{products.customer_phone}</TableCell>}
            {columns.includes("subtotal") && <TableCell>{products.subtotal}</TableCell>}
            {columns.includes("tax_amount") && <TableCell>{products.tax_amount}</TableCell>}
            {columns.includes("discount_amount") && <TableCell>{products.discount_amount}</TableCell>}
            {columns.includes("total_amount") && <TableCell>{products.total_amount}</TableCell>}
            {columns.includes("payment_method") && <TableCell>{products.payment_method}</TableCell>}
            {columns.includes("payment_status") && <TableCell>{products.payment_status}</TableCell>}
            {columns.includes("process_status") && <TableCell>{products.process_status}</TableCell>}
            {columns.includes("note") && <TableCell>{products.note}</TableCell>}
            {columns.includes("created_at") && <TableCell>{formatDate(products.created_at)}</TableCell>}
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, product.length)} of {product.length} products
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === page
                      ? "bg-amber-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}>
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
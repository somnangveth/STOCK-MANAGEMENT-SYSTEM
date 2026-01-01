"use client";
import ReceiptCard, { SaleItem } from "@/app/components/catalog/ReceiptCard";
import DialogForm from "@/app/components/DialogForm";
import { view } from "@/app/components/ui";
import { Button } from "@/components/ui/button";
import { Product, Sale } from "@/type/productType";

interface ReceiptB2CProps {
  sale: Sale & {
    items: SaleItem[];
    itemCount: number;
  };
  product: Product;
}

export default function ReceiptB2C({ sale,  product}: ReceiptB2CProps) {
  return (
    <DialogForm
      style="bg-white/50 backdrop-blur-sm"
      id={`receipt-${sale.sale_id}`}
      Trigger={
        <Button className="bg-blue-500 rounded-full hover:bg-blue-600 text-white">
          {view}
        </Button>
      }
      form={
        <ReceiptCard 
          saleData={sale} 
          productData={product} 
          saleItemData={sale.items}
        />
      }
    />
  );
}
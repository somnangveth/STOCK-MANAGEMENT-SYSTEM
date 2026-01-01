"use client";
import DialogForm from "@/app/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Price } from "@/type/productType";
import DiscountMultiple from "./DiscountAll";

export default function DiscountMultipleForm({ prices }: { prices: Price[] }) {
  // Debug: Log the prices to see what's being passed
  console.log("Prices passed to DiscountMultipleForm:", prices);
  
  return (
    <DialogForm
      id="add-discount"
      title={`Add Discount to ${prices.length} Product(s)`}
      Trigger={
        <Button>
          Add Discount to Selected
        </Button>
      }
      form={
        <div className="space-y-4">
          {prices.map((price, index) => {
            console.log(`Price ${index}:`, price);
            console.log(`Price ID ${index}:`, price?.price_id);
            
            return (
              <div key={price.price_id || index} className="border-b pb-4 last:border-b-0">
                <p className="text-xs text-gray-500 mb-2">
                  Debug - Price ID: {price.price_id || 'MISSING'}
                </p>
                <DiscountMultiple price={price} />
              </div>
            );
          })}
        </div>
      }
    />
  );
}
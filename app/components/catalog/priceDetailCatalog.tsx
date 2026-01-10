"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Price, Product } from "@/type/productType";

export default function PriceDetailCatalog({
  price,
  product,
}: {
  price: Price;
  product: Product;
}) {
  const [activeTab, setActiveTab] = useState<"price">("price");

  const text = "text-sm text-gray-500";

  return (
    <div>
      {/* HEADER */}
      <div className="border-b border-gray-600 p-2 flex justify-between">
        <Link href="/admin/price">
          <ArrowLeftIcon />
        </Link>
        <p>{product.product_name} Price Info</p>
      </div>

      {/* PRODUCT CARD (IMAGE + INFO) */}
      <div className="flex p-5 border border-gray-500 m-3 rounded-lg gap-5">
        {product.product_image ? (
          <img
            src={product.product_image}
            alt={product.product_name}
            className="w-[200px] h-[200px] object-cover rounded-md"
          />
        ) : (
          <img
            src="/assets/default.jpg"
            alt="default"
            className="w-[200px] h-[200px] object-cover rounded-md"
          />
        )}

        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold">{product.product_name}</h1>
          <p className={text}>SKU-CODE: {product.sku_code}</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-col gap-5 border-gray-500 mt-10">
        <div className="border-b border-gray-200">
          <button
            onClick={() => setActiveTab("price")}
            className="px-6 py-3 text-sm font-medium text-amber-600 border-b-2 border-amber-600 bg-amber-100"
          >
            Price Info
          </button>
        </div>

        {/* PRICE INFO PANEL */}
        <div className="min-h-[200px] p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={text}>Base Price</p>
              <p>{price.base_price}</p>
            </div>
            <div>
              <p className={text}>Profit</p>
              <p>{price.profit_price}</p>
            </div>
            <div>
              <p className={text}>Tax</p>
              <p>{price.tax}</p>
            </div>
            <div>
              <p className={text}>Shipping</p>
              <p>{price.shipping}</p>
            </div>
            <div>
              <p className={text}>Discount</p>
              <p>{price.discount_price}</p>
            </div>

            <div className="col-span-2 border-t pt-4 font-semibold text-lg">
              Total Price: {price.total_price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

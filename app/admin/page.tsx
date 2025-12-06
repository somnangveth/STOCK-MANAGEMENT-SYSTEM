"use client";
import Link from "next/link";
import { Package, DollarSign, ShoppingCart, Truck } from "lucide-react";
import TotalUsersCatalog from "../components/catalog/TotalUsersCatalog";
import TotalStockPanel from "../components/chart/totalStock";
import ProfileWelcome from "../components/profile/ProfileWelcome";
import ExpiryStockPanel from "../components/chart/expiryStock";
import AlertExpiredPanel from "../components/notifications/AlertExpiredPanel";

export default function AdminPage() {
  const panelStyle = 'flex-1 border border-amber-600 bg-amber-700 text-white font-semibold  rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-6 flex items-center justify-center';
  
  return (
    <div className="p-6 space-y-6  min-h-screen">
      <ProfileWelcome/>
      
      <div className="flex h-28 gap-4">
        <div className={panelStyle}>
          <Link href="/admin/products" className="text-lg hover:text-amber-100 transition-colors flex flex-col items-center gap-2">
            <Package size={32} />
            Inventory
          </Link>
        </div>
        <div className={panelStyle}>
          <Link href="/admin/price" className="text-lg hover:text-amber-100 transition-colors flex flex-col items-center gap-2">
            <DollarSign size={32} />
            Price Management
          </Link>
        </div>
        <div className={panelStyle}>
          <Link href="/admin/sales" className="text-lg hover:text-amber-100 transition-colors flex flex-col items-center gap-2">
            <ShoppingCart size={32} />
            Sales Management
          </Link>
        </div>
        <div className={panelStyle}>
          <Link href="/admin/vendors" className="text-lg hover:text-amber-100 transition-colors flex flex-col items-center gap-2">
            <Truck size={32} />
            Suppliers Management
          </Link>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="w-1/3 shadow-lg rounded-xl overflow-hidden bg-white">
          <TotalStockPanel/>
        </div>
        <div className="w-1/3 shadow-lg rounded-xl overflow-hidden bg-white">
          <ExpiryStockPanel/>
        </div>
      </div>
      
      <div className="flex w-full gap-4">
        <div className="w-1/3 ">
          <TotalUsersCatalog/>
        </div>
        <div className="w-1/3 shadow-lg rounded-xl overflow-hidden bg-white flex items-center justify-center text-gray-400 text-xl">
          Hello
        </div>
        <div className="w-1/3 border border-gray-200 shadow-lg rounded-xl overflow-hidden bg-white">
          <div>
            <div className="h-12 bg-amber-700 flex justify-center items-center text-amber-50 font-semibold text-lg shadow-sm">
              Expiry Notification
            </div>
            <div className="m-3 h-45 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-600 scrollbar-track-gray-100">
              <AlertExpiredPanel/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
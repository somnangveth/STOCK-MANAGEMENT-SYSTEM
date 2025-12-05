"use client";

import Link from "next/link";
import TotalUsersCatalog from "../components/catalog/TotalUsersCatalog";
import TotalStockPanel from "../components/chart/totalStock";
import ProfileWelcome from "../components/profile/ProfileWelcome";
import ExpiryStockPanel from "../components/chart/expiryStock";
import AlertExpiredPanel from "../components/notifications/AlertExpiredPanel";

export default function AdminPage() {

  return (
    <div className="p-6 space-y-6">
      <ProfileWelcome/>
      <div className="flex h-25 gap-2">
        <div className="flex-1 border border-gray-500 ">
          <Link href="/admin/products">Inventory</Link>
        </div>
        <div className="flex-1 border border-gray-500 ">
          <Link href="/admin/price">Price Management</Link>
        </div>
        <div className="flex-1 border border-gray-500 ">
          <Link href="/admin/sales">Sales Management</Link>
        </div>
        <div className="flex-1 border border-gray-500 ">
          <Link href="/admin/vendors">Suppliers Management</Link>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-1/3">
          <TotalStockPanel/>
        </div>
        <div className="w-1/3">
          <ExpiryStockPanel/>
        </div>
      </div>
        <div className=" flex w-full gap-2">
          <div className="w-1/3">
            <TotalUsersCatalog/>
          </div>
          <div className="w-1/3">
            Hello
          </div>

          <div className="w-1/3 border ">
            <div>
              <div className="h-15 bg-amber-400 text-amber-900 flex justify-center">
                Expiry Notification
              </div>
              <AlertExpiredPanel/>
            </div>
          </div>
        </div>
    </div>
  );
}

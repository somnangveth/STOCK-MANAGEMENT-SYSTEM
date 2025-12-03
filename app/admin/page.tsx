"use client";

import TotalUsersCatalog from "../components/catalog/TotalUsersCatalog";
import TotalStockPanel from "../components/chart/totalStock";
import ProfileWelcome from "../components/profile/ProfileWelcome";

export default function AdminPage() {

  return (
    <div className="p-6 space-y-6">
      <ProfileWelcome/>
      <div className="flex sm:flex-col">
        <div className="w-1/3">
          <TotalStockPanel/>
        </div>
      </div>
        <div className="w-full">
          <TotalUsersCatalog/>
        </div>
    </div>
  );
}

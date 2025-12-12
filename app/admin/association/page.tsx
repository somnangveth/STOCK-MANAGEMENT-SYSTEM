"use client";
import AddAssociatedForm from "./components/AddAssociatedForm";
import AssociatedCatalog from "./components/AssociatedCatalog";

export default function AssociationPage() {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          {/* Top Right Button */}
          <AddAssociatedForm id="associated-trigger" />
        </div>

        {/* Catalog Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <AssociatedCatalog />
        </div>
      </div>
    </div>
  );
}
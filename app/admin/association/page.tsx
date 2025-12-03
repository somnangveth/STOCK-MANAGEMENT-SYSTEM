"use client";
import { Product } from "@/type/productType";
import AddAssociatedForm from "./components/AddAssociatedForm";
import AssociatedCatalog from "./components/AssociatedCatalog";
import { useState } from "react";

export default function AssociationPage() {
  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-6">

        <AddAssociatedForm id="associated-trigger" />
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AssociatedCatalog />
      </div>
    </div>
  );
}
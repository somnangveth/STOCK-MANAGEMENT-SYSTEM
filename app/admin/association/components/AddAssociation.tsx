"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/type/productType";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { addAssociation } from "@/app/functions/stock/assocation/association";
import SelectedProductListForm from "@/app/components/catalog/proListForm";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { FaLink } from "react-icons/fa";
// -----------------------------
// ZOD Schema
// -----------------------------
const FormSchema = z.object({
  product_id: z.string().min(1, "Please select a main product"),
  associated_product_id: z.array(z.string()).min(1, "Please select at least one associated product"),
  association_type: z.enum(["related", "bundle", "alternative"])
});

export default function AddAssociation({onClose}:{onClose: () => void}) {
  // Hooks
  const [isPending, startTransition] = useTransition();
  
  // Popup states
  const [openMainSelector, setOpenMainSelector] = useState(false);
  const [openAssociatedSelector, setOpenAssociatedSelector] = useState(false);
  
  const [selectedMainProduct, setSelectedMainProduct] = useState<Product | null>(null);
  const [selectedAssociatedProducts, setSelectedAssociatedProducts] = useState<Product[]>([]);
  
  const associationTypes = ["related", "bundle", "alternative"];
  
  // Form
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      product_id: "",
      associated_product_id: [],
      association_type: "related"
    }
  });

  // -----------------------------
  // Fetch products
  // -----------------------------
  async function fetchProducts() {
    const res = await fetch("/api/admin/fetchProducts");
    if (!res.ok) throw new Error("Failed fetching products");
    return res.json();
  }

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts
  });

  if (isLoading) return <p>Loading products…</p>;
  if (error || !products) return <p>Failed to load products…</p>;

  // -----------------------------
  // Submit Handler
  // -----------------------------
  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      try {
        const result = await addAssociation(data);
        console.log("Result:", result);
        // Reset form
        form.reset();
        setSelectedMainProduct(null);
        setSelectedAssociatedProducts([]);
        alert("Association added successfully!");
        onClose();
      } catch (err) {
        console.error(err);
        alert("Failed to add association");
      }
    });
  }

  // Filter out main product from associated products list
  const availableAssociatedProducts = selectedMainProduct
    ? products.filter(p => p.product_id !== selectedMainProduct.product_id)
    : products;

  return (
    <div className="w-full h-full p-6 space-y-6 border-l border-gray-200">
      <h1 className="flex justify-center text-2xl font-bold">Add Product Association</h1>

      {/* ----------  Main Product Selection  ---------- */}
      <div className="space-y-2">
        <label className="font-semibold text-sm text-gray-500">Main Product *</label>
        <button
          type="button"
          onClick={() => setOpenMainSelector(true)}
          className="w-full p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-left transition-colors border border-slate-300"
        >
          {selectedMainProduct ? (
            <div className="flex items-center gap-3">
              <img 
                src={selectedMainProduct.product_image} 
                alt={selectedMainProduct.product_name}
                className="w-10 h-10 rounded object-cover"
              />
              <span>{selectedMainProduct.product_name}</span>
            </div>
          ) : (
            <span className="text-slate-500">Click to select main product</span>
          )}
        </button>
        
        {/* Main Product Selector Dialog */}
        <SelectedProductListForm
          isOpen={openMainSelector}
          onClose={() => setOpenMainSelector(false)}
          onSelect={(p) => {
            setSelectedMainProduct(p);
            form.setValue("product_id", p.product_id);
            // Clear associated products if main product was in the list
            const filtered = selectedAssociatedProducts.filter(
              ap => ap.product_id !== p.product_id
            );
            if (filtered.length !== selectedAssociatedProducts.length) {
              setSelectedAssociatedProducts(filtered);
              form.setValue("associated_product_id", filtered.map(ap => ap.product_id));
            }
            setOpenMainSelector(false);
          }}
          multiple={false}
        />
        
        {form.formState.errors.product_id && (
          <p className="text-red-500 text-sm">{form.formState.errors.product_id.message}</p>
        )}
      </div>

      {/* ----------  Association Type  ---------- */}
      <div className="space-y-2">
        <label className="font-semibold text-sm text-gray-500">Association Type *</label>
        <div className="flex gap-2">
          <div className="w-1/3 border p-2 rounded-lg ">
            <FaLink/>
          </div>
          <Select
          onValueChange={(v) => form.setValue("association_type", v as any)}
          defaultValue="related"
        >
          <SelectTrigger className="w-2/3">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {associationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
      </div>

      {/* ----------  Associated Products  ---------- */}
      <div className="space-y-2">
        <label className="font-semibold text-sm text-gray-500">Associated Products *</label>
        <button
          type="button"
          onClick={() => setOpenAssociatedSelector(true)}
          disabled={!selectedMainProduct}
          className="w-full p-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-left transition-colors border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedAssociatedProducts.length === 0 ? (
            <span className="text-slate-500">
              {selectedMainProduct 
                ? "Click to select associated products" 
                : "Select main product first"}
            </span>
          ) : (
            <div className="space-y-2">
              <span className="text-sm text-slate-600">
                {selectedAssociatedProducts.length} product(s) selected
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedAssociatedProducts.map((p) => (
                  <span 
                    key={p.product_id}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <img 
                      src={p.product_image} 
                      alt={p.product_name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    {p.product_name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </button>
        
        {/* Associated Products Selector Dialog */}
        <SelectedProductListForm
          isOpen={openAssociatedSelector}
          onClose={() => setOpenAssociatedSelector(false)}
          multiple={true}
          selectedProducts={selectedAssociatedProducts}
          onSelectMultiple={(list) => {
            setSelectedAssociatedProducts(list);
            form.setValue(
              "associated_product_id",
              list.map((p) => p.product_id)
            );
          }}
        />
        
        {form.formState.errors.associated_product_id && (
          <p className="text-red-500 text-sm">{form.formState.errors.associated_product_id.message}</p>
        )}
      </div>

      {/* ---------- Submit ---------- */}
      <div className="flex gap-2 justify-end">
        <button
        className="
        border border-gray-500 rounded-lg p-2
        hover:bg-gray-500 hover:text-gray-500"
        onClick={() => onClose()}>
          Cancel
        </button>
        <button
        type="button"
        disabled={isPending || !selectedMainProduct || selectedAssociatedProducts.length === 0}
        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={form.handleSubmit(onSubmit)}
      >
        {isPending ? "Saving..." : "Save Association"}
      </button>
      </div>

      {/* Summary */}
      {selectedMainProduct && selectedAssociatedProducts.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>{selectedMainProduct.product_name}</strong> will be associated as{" "}
            <strong>{form.watch("association_type")}</strong> with{" "}
            <strong>{selectedAssociatedProducts.length}</strong> product(s)
          </p>
        </div>
      )}
    </div>
  );
}
// app/admin/purchase/[poId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Calendar, Truck, Package, User, MapPin, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { fetchPurchaseOrder } from "../components/action/purchase-order";
import Image from "next/image";
import type { PurchaseOrderDetail, PurchaseItem } from "@/type/productType";
import StatusDialog from "../components/po-status-dialog";
import ReceiveDialog from "../components/po-receive-model";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [po, setPO] = useState<PurchaseOrderDetail | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);

  useEffect(() => {
    if (params.poId) {
      const purchaseId = Array.isArray(params.poId) ? params.poId[0] : params.poId;
      setId(purchaseId);
    }
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await fetchPurchaseOrder(id);

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.data) {
          throw new Error("No data returned from server");
        }

        setPO(result.data as PurchaseOrderDetail);
      } catch (err: any) {
        console.error("Error loading purchase order:", err);
        setError(err.message);
        toast.error("Failed to load purchase order: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleStatusDialogSuccess = () => {
    setShowStatusDialog(false);
    window.location.reload();
  };

  const handleReceiveSuccess = () => {
    setShowReceiveDialog(false);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12">
            <div className="flex items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Loading purchase order...</p>
                <p className="text-sm text-gray-600">ID: {id || "waiting..."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8">
            <div className="text-center">
              <div className="text-red-600 text-5xl mb-4">⚠️</div>
              <p className="text-lg font-semibold text-red-600 mb-2">Failed to Load</p>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
                Reload
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <p className="text-gray-600">Purchase order not found</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-slate-100 text-slate-800",
      submitted: "bg-blue-100 text-blue-800",
      confirmed: "bg-purple-100 text-purple-800",
      received: "bg-green-100 text-green-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const statusConfig = getStatusColor(po.status);
  const receivedCount = po.purchase_items.filter(item => (item.received_quantity || 0) >= item.quantity).length;
  const completionPercentage = po.purchase_items.length === 0 ? 0 : Math.round((receivedCount / po.purchase_items.length) * 100);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => window.history.back()} className="mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* PO Info Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-amber-200 to-yellow-300 px-7 py-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-amber-800 text-sm font-medium">Purchase Order Number</p>
                  <h1 className="text-4xl font-bold text-amber-600 mt-1">{po.po_number}</h1>
                </div>
                <div className={`${statusConfig} px-4 py-2 rounded-lg font-semibold`}>
                  {po.status.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="px-8 py-6">
              <p className="text-gray-600 mb-6">{po.vendor_name}</p>
              
              {/* Action Buttons */}
              {/* Action Buttons */}
    <div className="flex gap-3 mb-6">
      <Button
        onClick={() => setShowStatusDialog(true)}
        variant="outline"
        className="
          flex-1
          border-amber-500
          text-yellow-600
          hover:bg-yellow-400
          hover:text-orange-800
        "
      >
        <ChevronRight className="h-4 w-4 mr-2" />
        Update Status
      </Button>

          <Button
            onClick={() => setShowReceiveDialog(true)}
            variant="outline"
            className="
              flex-1
              border-rose-500
              text-rose-600
              hover:bg-rose-400
              hover:text-red-800"
                >
              <Package className="h-4 w-4 mr-2" />
              Record Receipt
            </Button>
          </div>


              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Purchase Date</p>
                    <p className="font-semibold text-gray-900">{new Date(po.purchase_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-600">Expected Delivery</p>
                    <p className="font-semibold text-gray-900">{po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Card */}
          <div
          className="
            rounded-2xl
              border border-amber-400
              p-8
              text-slate-900
              bg-linear-to-br
              from-amber-50/30
              to-white
              shadow-sm">
              <p className="text-amber-700 text-sm font-medium">
                Total Amount
              </p>

              <h2 className="text-5xl font-bold mt-2 text-red-400">
                ${po.total_amount?.toFixed(2)}
              </h2>

          <div className="mt-6 space-y-3 pt-6 border-t border-yellow-500">
            <div className="flex justify-between text-sm">
              <span className="text-yellow-600">Subtotal:</span>
              <span className="font-semibold text-yellow-400">
                ${po.subtotal?.toFixed(2)}
              </span>
            </div>
          </div>
          </div>
        </div>

        {/* Vendor Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-yellow-600" />
            Vendor Information
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {po.vendor_image ? (
                <Image
                  src={po.vendor_image}
                  alt={po.vendor_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{po.vendor_name}</h4>
              {po.payment_terms && (
                <p className="text-gray-600 mb-3">
                  <span className="font-semibold">Payment Terms:</span> {po.payment_terms}
                </p>
              )}
            </div>
          </div>
          {po.note && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">Notes:</span> {po.note}
              </p>
            </div>
          )}
        </div>

        {/* Completion Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5  text-yellow-600" />
              Delivery Progress
            </h3>
            <span className="text-2xl font-bold text-yellow-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-yellow-500 to-yellow-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">{receivedCount} of {po.purchase_items.length} items fully received</p>
        </div>

        {/* Purchase Items */}
        {po.purchase_items && po.purchase_items.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-8 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-6 w-6 text-yellow-600" />
                Purchase Items ({po.purchase_items.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {po.purchase_items.map((item: PurchaseItem) => {
                const isFullyReceived = (item.received_quantity || 0) >= item.quantity;
                return (
                  <div key={item.purchase_item_id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{item.product_name}</h4>
                            {item.sku_code && <p className="text-sm text-gray-600">SKU: {item.sku_code}</p>}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${isFullyReceived ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {item.received_quantity || 0}/{item.quantity}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">Quantity</p>
                            <p className="text-lg font-bold text-gray-900">{item.quantity}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">Unit Price</p>
                            <p className="text-lg font-bold text-gray-900">${item.unit_price?.toFixed(2)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">${item.total_price?.toFixed(2)}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-xs text-yellow-600 font-medium">Received</p>
                            <p className="text-lg font-bold text-amber-600">{item.received_quantity || 0}</p>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="flex flex-wrap gap-3 text-sm">
                          {item.batch_number && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <span className="font-medium">Batch:</span>
                              <span>{item.batch_number}</span>
                            </div>
                          )}
                          {item.warehouse_location && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{item.warehouse_location}</span>
                            </div>
                          )}
                          {item.expiry_date && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>Expires: {new Date(item.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Status Dialog */}
        {showStatusDialog && po && (
          <StatusDialog
            poId={po.purchase_id}
            currentStatus={po.status}
            poNumber={po.po_number}
            onSuccess={handleStatusDialogSuccess}
            onCancel={() => setShowStatusDialog(false)}
          />
        )}

        {/* Receive Dialog */}
        {showReceiveDialog && po && (
          <ReceiveDialog
            po={po}
            onSuccess={handleReceiveSuccess}
            onCancel={() => setShowReceiveDialog(false)}
          />
        )}
      </div>
    </div>
  );
}
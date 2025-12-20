"use client";

export default function ReceiptCard() {
  // Styling
  const text = "text-sm text-gray-600";
  const thead = "text-sm font-semibold text-gray-700";
  const label = "text-sm text-gray-600";
  const value = "text-sm font-medium text-gray-800";

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6 font-mono">
      {/* Header */}
      <p className="font-bold text-lg text-center border-b border-gray-300 pb-3 mb-4">
        RECEIPT
      </p>

      {/* Receipt Info */}
      <div className="flex justify-between mb-6">
        <div className="flex flex-col gap-1">
          <p className={text}>Date: 14-12-2025</p>
          <p className={text}>Created at: 10:30 AM</p>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <p className={text}>Receipt #: 001234</p>
          <p className={text}>Cashier: John Doe</p>
        </div>
      </div>

      {/* Product Lists */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className={`${thead} text-left pb-2`}>Description</th>
              <th className={`${thead} text-center pb-2`}>Qty</th>
              <th className={`${thead} text-right pb-2`}>Unit</th>
              <th className={`${thead} text-right pb-2`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`${text} border-b border-gray-200`}>
              <td className="py-2">Konjac Black Milk Tea</td>
              <td className="py-2 text-center">1</td>
              <td className="py-2 text-right">4,500</td>
              <td className="py-2 text-right">4,500</td>
            </tr>
            <tr className={`${text} border-b border-gray-200`}>
              <td className="py-2">Matcha Latte</td>
              <td className="py-2 text-center">2</td>
              <td className="py-2 text-right">5,000</td>
              <td className="py-2 text-right">10,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Subtotal Calculation */}
      <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-gray-300">
        <div className="flex justify-between">
          <span className={label}>SUBTOTAL:</span>
          <span className={value}>14,500</span>
        </div>
        <div className="flex justify-between">
          <span className={label}>DISCOUNT (0%):</span>
          <span className={value}>0</span>
        </div>
        <div className="flex justify-between">
          <span className={label}>ITEMS:</span>
          <span className={value}>3</span>
        </div>
      </div>

      {/* Total Calculation */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-800">TOTAL:</span>
          <span className="text-base font-bold text-gray-800">14,500</span>
        </div>
        <div className="flex justify-between">
          <span className={label}>Cash In:</span>
          <span className={value}>20,000</span>
        </div>
        <div className="flex justify-between">
          <span className={label}>Change:</span>
          <span className={value}>5,500</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-300 text-center">
        <p className="text-xs text-gray-500">Thank you for your purchase!</p>
        <p className="text-xs text-gray-500">Please come again</p>
      </div>
    </div>
  );
}
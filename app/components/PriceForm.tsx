export default function PriceForm({ productId, data }) {
  const [base, setBase] = useState(data.base);
  const [rule, setRule] = useState(data.rule);

  // Save handler
  const save = async () => {
    await fetch(`/api/products/${productId}/price`, {
      method: "PUT",
      body: JSON.stringify(base),
    });

    await fetch(`/api/products/${productId}/rules`, {
      method: "PUT",
      body: JSON.stringify(rule),
    });

    alert("Saved successfully!");
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      <h2 className="col-span-2 text-xl font-semibold">Edit Price</h2>

      {/* Base Price */}
      <div>
        <h3 className="font-medium">Product Information</h3>

        <label>Base Price</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={base.base_price}
          onChange={(e) => setBase({ ...base, base_price: e.target.value })}
        />

        <label>Profit Price</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={base.profit_price}
          onChange={(e) => setBase({ ...base, profit_price: e.target.value })}
        />

        <label>Tax (%)</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={base.tax_percentage}
          onChange={(e) => setBase({ ...base, tax_percentage: e.target.value })}
        />

        <label>Shipping Cost</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={base.shipping_cost}
          onChange={(e) => setBase({ ...base, shipping_cost: e.target.value })}
        />
      </div>

      {/* Discount */}
      <div>
        <h3 className="font-medium">Discount Settings</h3>

        <label>Discount %</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={rule.discount_percentage}
          onChange={(e) =>
            setRule({ ...rule, discount_percentage: e.target.value })
          }
        />

        <label>Start Date</label>
        <input
          type="date"
          className="border p-2 w-full"
          value={rule.start_date}
          onChange={(e) => setRule({ ...rule, start_date: e.target.value })}
        />

        <label>End Date</label>
        <input
          type="date"
          className="border p-2 w-full"
          value={rule.end_date}
          onChange={(e) => setRule({ ...rule, end_date: e.target.value })}
        />

        <label>Note</label>
        <textarea
          className="border p-2 w-full"
          value={rule.note}
          onChange={(e) => setRule({ ...rule, note: e.target.value })}
        />
      </div>

      <button
        className="col-span-2 bg-green-600 text-white p-3 rounded"
        onClick={save}
      >
        Save Price
      </button>
    </div>
  );
}

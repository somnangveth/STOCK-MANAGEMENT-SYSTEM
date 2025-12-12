// app/admin/sales/components/editmodel.tsx

"use client";

import React from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  data: any;
  onSave: (values: any) => void;
}

export default function EditSidebar({ open, onClose, data, onSave }: SidebarProps) {
  const [values, setValues] = React.useState(data);

  React.useEffect(() => {
    setValues(data);
  }, [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
      
      <div className="w-96 bg-white h-full shadow-2xl p-6 animate-slide-left overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">编辑</h2>

        {Object.keys(values || {}).map((key) => (
          <div key={key} className="mb-3">
            <label className="text-sm text-gray-600">{key}</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={values[key] ?? ""}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            />
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            取消
          </button>
          <button
            onClick={() => onSave(values)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            保存
          </button>
        </div>
      </div>

    </div>
  );
}

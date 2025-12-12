// app/admin/sales/components/MoreMenu.tsx

"use client";

import { useState, useRef, useEffect } from "react";

export default function MoreMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外面关闭
  useEffect(() => {
    const handleClick = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* 三点按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 rounded hover:bg-gray-200 transition"
      >
        ⋮
      </button>

      {/* 弹出的菜单 */}
      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white shadow-lg border rounded-xl py-2 text-sm z-50">
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}

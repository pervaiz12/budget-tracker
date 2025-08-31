"use client";

import { useEffect, useState } from "react";
import { subscribe, ToastMessage } from "../lib/toast";

export default function Toaster() {
  const [items, setItems] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsub = subscribe((msg) => {
      setItems((prev) => [...prev, msg]);
      // Auto remove after 3s
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== msg.id));
      }, 3000);
    });
    return unsub;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {items.map((i) => (
        <div
          key={i.id}
          className={
            "min-w-[240px] max-w-[360px] px-4 py-2 rounded-lg shadow-lg text-sm border " +
            (i.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : i.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-gray-50 text-gray-800 border-gray-200")
          }
        >
          {i.text}
        </div>
      ))}
    </div>
  );
}

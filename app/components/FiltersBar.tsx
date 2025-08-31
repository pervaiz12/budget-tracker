"use client";

import { useState, useEffect } from "react";
import { toast } from "../lib/toast";

export type Filters = {
  q?: string;
  category?: string;
  type?: "income" | "expense" | "";
  startDate?: string;
  endDate?: string;
  minAmount?: string;
  maxAmount?: string;
};

const categories = [
  "Food",
  "Transportation",
  "Housing",
  "Entertainment",
  "Shopping",
  "Salary",
  "Freelance",
  "Other",
];

export default function FiltersBar({
  value,
  onChange,
  onApply,
  onClear,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const [local, setLocal] = useState<Filters>(value || {});

  useEffect(() => {
    setLocal(value || {});
  }, [value]);

  const set = (patch: Partial<Filters>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <input
          className="md:col-span-3 border rounded-lg px-3 py-2"
          placeholder="Search description..."
          value={local.q || ""}
          onChange={(e) => set({ q: e.target.value })}
        />
        <select
          className="md:col-span-2 border rounded-lg px-3 py-2"
          value={local.category || ""}
          onChange={(e) => set({ category: e.target.value || undefined })}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="md:col-span-2 border rounded-lg px-3 py-2"
          value={local.type || ""}
          onChange={(e) => set({ type: (e.target.value as Filters["type"]) || "" })}
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="date"
          className="md:col-span-2 border rounded-lg px-3 py-2"
          value={local.startDate || ""}
          onChange={(e) => set({ startDate: e.target.value })}
        />
        <input
          type="date"
          className="md:col-span-2 border rounded-lg px-3 py-2"
          value={local.endDate || ""}
          onChange={(e) => set({ endDate: e.target.value })}
        />
        <input
          type="number"
          className="md:col-span-1 border rounded-lg px-3 py-2"
          placeholder="Min"
          value={local.minAmount || ""}
          onChange={(e) => set({ minAmount: e.target.value })}
        />
        <input
          type="number"
          className="md:col-span-1 border rounded-lg px-3 py-2"
          placeholder="Max"
          value={local.maxAmount || ""}
          onChange={(e) => set({ maxAmount: e.target.value })}
        />
      </div>
      <div className="mt-3 flex gap-3 justify-end">
        <button
          onClick={() => {
            onClear();
            toast.info("Filters cleared");
          }}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg transition"
        >
          Clear
        </button>
        <button
          onClick={() => {
            onApply();
            toast.success("Filters applied");
          }}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

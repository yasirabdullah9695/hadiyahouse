import React from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { productsApi } from "@/api/apiClient";

export default function AdminProductTable({ products, onEdit, onRefresh }) {
  const toggleHide = async (p) => {
    await productsApi.update(p.id, { hidden: !p.hidden });
    onRefresh();
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    await productsApi.delete(p.id);
    onRefresh();
  };

  if (products.length === 0) {
    return <p className="text-center text-[#1A1F2C]/50 text-sm py-12">No products yet. Add your first product.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#D4C3A5]/30">
      <table className="w-full text-left">
        <thead className="bg-[#1A1F2C] text-[#F9F7F2]">
          <tr>
            <th className="px-4 py-3 text-[10px] tracking-[0.15em] font-semibold">IMAGE</th>
            <th className="px-4 py-3 text-[10px] tracking-[0.15em] font-semibold">NAME</th>
            <th className="px-4 py-3 text-[10px] tracking-[0.15em] font-semibold">CATEGORY</th>
            <th className="px-4 py-3 text-[10px] tracking-[0.15em] font-semibold">PRICE</th>
            <th className="px-4 py-3 text-[10px] tracking-[0.15em] font-semibold">BADGE</th>
            <th className="px-4 py-3 text-[10px] tracking-[0.15em] font-semibold">STATUS</th>
            <th className="px-4 py-3 text-[10px] tracking-[0.15em] font-semibold text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-[#D4C3A5]/20 hover:bg-[#F9F7F2]">
              <td className="px-4 py-3">
                <div className="w-12 h-14 rounded overflow-hidden bg-[#F0EDE5]">
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="text-[13px] font-medium text-[#1A1F2C]">{p.name}</p>
                <p className="text-[11px] text-[#1A1F2C]/50">{p.inclusions?.length || 0} items inside</p>
              </td>
              <td className="px-4 py-3 text-[12px] text-[#1A1F2C]/70">{p.category}</td>
              <td className="px-4 py-3 text-[13px] font-semibold text-[#1A1F2C]">₹{p.price?.toLocaleString("en-IN")}</td>
              <td className="px-4 py-3 text-[11px] text-[#1A1F2C]/70">{p.badge || "—"}</td>
              <td className="px-4 py-3">
                {p.hidden ? (
                  <span className="text-[10px] tracking-[0.1em] font-semibold text-[#C5564A]">HIDDEN</span>
                ) : (
                  <span className="text-[10px] tracking-[0.1em] font-semibold text-[#4A5D4E]">VISIBLE</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => toggleHide(p)} title={p.hidden ? "Show" : "Hide"} className="p-2 rounded-lg hover:bg-[#D4C3A5]/20 text-[#1A1F2C]/70">
                    {p.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => onEdit(p)} title="Edit" className="p-2 rounded-lg hover:bg-[#D4C3A5]/20 text-[#1A1F2C]/70">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(p)} title="Delete" className="p-2 rounded-lg hover:bg-[#C5564A]/10 text-[#C5564A]">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
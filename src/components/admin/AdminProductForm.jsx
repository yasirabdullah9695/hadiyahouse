import React, { useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { productsApi, uploadApi } from "@/api/apiClient";
import { ALL_CATEGORIES, PRODUCT_TYPES } from "@/lib/constants";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  type: "Gift Box",
  category: "Nikah",
  image: "",
  inclusions: [],
  badge: "",
  gender: "all",
  best_seller: false,
  hidden: false,
  featured: false,
};

export default function AdminProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product ? { ...EMPTY, ...product, price: product.price ?? "" } : EMPTY);
  const [inclusionInput, setInclusionInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: type === "checkbox" ? checked : value };
      if (name === "type") {
        const firstCat = ALL_CATEGORIES.find((c) => c.type === value);
        next.category = firstCat?.key || "";
      }
      return next;
    });
  };

  const addInclusion = () => {
    const v = inclusionInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, inclusions: [...(f.inclusions || []), v] }));
    setInclusionInput("");
  };

  const removeInclusion = (idx) => {
    setForm((f) => ({ ...f, inclusions: f.inclusions.filter((_, i) => i !== idx) }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadApi.uploadImage(file);
      setForm((f) => ({ ...f, image: result.file_url }));
    } catch (err) {
      alert("Upload failed. Please try again. " + (err.message || ""));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      inclusions: form.inclusions || [],
    };
    try {
      if (product?.id) {
        await productsApi.update(product.id, payload);
      } else {
        await productsApi.create(payload);
      }
      onSaved();
    } catch (err) {
      alert("Failed to save product. " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-[#1A1F2C]/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-[#F9F7F2] rounded-2xl max-w-2xl w-full my-auto">
        <div className="flex items-center justify-between p-5 border-b border-[#D4C3A5]/30 sticky top-0 bg-[#F9F7F2] rounded-t-2xl z-10">
          <h3 className="font-display text-xl text-[#1A1F2C]">{product ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} className="text-[#1A1F2C]/60 hover:text-[#1A1F2C]"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Image upload */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-2">PRODUCT IMAGE</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-28 rounded-lg overflow-hidden bg-[#F0EDE5] border border-[#D4C3A5]/30 flex-shrink-0">
                {form.image ? (
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#1A1F2C]/30 text-[10px]">No image</div>
                )}
              </div>
              <label className="flex items-center gap-2 text-[11px] tracking-[0.15em] font-semibold text-[#1A1F2C] border border-[#1A1F2C]/30 px-4 py-2.5 rounded-full cursor-pointer hover:bg-[#1A1F2C] hover:text-[#F9F7F2] transition-colors">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? "UPLOADING..." : "UPLOAD IMAGE"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="or paste image URL"
              className="w-full mt-3 bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">PRODUCT NAME *</label>
              <input name="name" required value={form.name} onChange={handleChange} className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">PRICE (₹) *</label>
              <input name="price" type="number" required value={form.price} onChange={handleChange} className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">TYPE *</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]">
                {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">CATEGORY *</label>
              <select
                name="category"
                required
                value={form.category && ALL_CATEGORIES.some(c => c.key === form.category && c.type === form.type) ? form.category : (form.category ? "custom" : "")}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "custom") {
                    setForm((f) => ({ ...f, category: "" }));
                  } else {
                    setForm((f) => ({ ...f, category: val }));
                  }
                }}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              >
                <option value="">Select a category</option>
                {ALL_CATEGORIES.filter((c) => c.type === form.type).map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
                <option value="custom">+ Custom Category...</option>
              </select>
              
              {(!ALL_CATEGORIES.some(c => c.key === form.category && c.type === form.type) || form.category === "") && (
                <input
                  type="text"
                  name="category"
                  placeholder="Enter custom category name"
                  required
                  value={form.category === "custom" ? "" : form.category}
                  onChange={handleChange}
                  className="w-full mt-2.5 bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
                />
              )}
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">BADGE</label>
              <select name="badge" value={form.badge} onChange={handleChange} className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]">
                <option value="">None</option>
                <option value="Best Seller">Best Seller</option>
                <option value="New Arrival">New Arrival</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">GENDER FILTER</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]">
                <option value="all">All</option>
                <option value="him">For Him</option>
                <option value="her">For Her</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">DESCRIPTION</label>
            <textarea name="description" rows={2} value={form.description} onChange={handleChange} className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C] resize-none" />
          </div>

          {/* Inclusions */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">WHAT'S INSIDE (Inclusions)</label>
            <div className="flex gap-2">
              <input
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInclusion(); } }}
                placeholder="e.g. Quran, Prayer Mat, Attar..."
                className="flex-1 bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              />
              <button type="button" onClick={addInclusion} className="bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-semibold px-5 rounded-lg hover:bg-[#2a3142]">ADD</button>
            </div>
            {form.inclusions?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.inclusions.map((inc, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-[#D4C3A5]/20 text-[#1A1F2C] text-[12px] px-3 py-1.5 rounded-full">
                    {inc}
                    <button type="button" onClick={() => removeInclusion(i)} className="text-[#1A1F2C]/50 hover:text-[#C5564A]">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { key: "best_seller", label: "Best Seller" },
              { key: "featured", label: "Featured on Home" },
              { key: "hidden", label: "Hide from Store" },
            ].map((t) => (
              <label key={t.key} className="flex items-center gap-2 text-[12px] font-medium text-[#1A1F2C] cursor-pointer">
                <input type="checkbox" name={t.key} checked={!!form[t.key]} onChange={handleChange} className="w-4 h-4 accent-[#1A1F2C]" />
                {t.label}
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-[#1A1F2C]/30 text-[#1A1F2C] text-[12px] tracking-[0.15em] font-semibold py-3.5 rounded-full hover:bg-[#1A1F2C]/5">CANCEL</button>
            <button type="submit" disabled={saving} className="flex-1 bg-[#1A1F2C] text-[#F9F7F2] text-[12px] tracking-[0.15em] font-semibold py-3.5 rounded-full hover:bg-[#2a3142] disabled:opacity-60 flex items-center justify-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "SAVING..." : "SAVE PRODUCT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
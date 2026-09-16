import React, { useState } from "react";
import { X, Upload, Loader2, Trash2, Plus, Star } from "lucide-react";
import { productsApi, uploadApi } from "@/api/apiClient";
import { ALL_CATEGORIES, PRODUCT_TYPES } from "@/lib/constants";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  type: "Gift Box",
  category: "Nikah",
  images: [],
  inclusions: [],
  badge: "",
  gender: "all",
  best_seller: false,
  hidden: false,
  featured: false,
};

export default function AdminProductForm({ product, onClose, onSaved }) {
  const getInitialImages = () => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    if (product.image) return [product.image];
    return [];
  };

  const [form, setForm] = useState(
    product
      ? {
          ...EMPTY,
          ...product,
          price: product.price ?? "",
          images: getInitialImages(),
        }
      : EMPTY
  );
  const [urlInput, setUrlInput] = useState("");
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

  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);

    try {
      const uploadedUrls = [];
      for (const file of files) {
        try {
          const result = await uploadApi.uploadImage(file);
          if (result && (result.file_url || result.url)) {
            uploadedUrls.push(result.file_url || result.url);
          }
        } catch (err) {
          console.warn("Backend upload failed, converting image to data URL fallback...", err);
          const dataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (evt) => resolve(evt.target.result);
            reader.readAsDataURL(file);
          });
          if (dataUrl) uploadedUrls.push(dataUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        setForm((f) => ({
          ...f,
          images: [...(f.images || []), ...uploadedUrls],
        }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image(s)");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddImageUrl = (e) => {
    if (e) e.preventDefault();
    const url = urlInput.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...(f.images || []), url] }));
    setUrlInput("");
  };

  const removeImage = (idx) => {
    setForm((f) => ({
      ...f,
      images: (f.images || []).filter((_, i) => i !== idx),
    }));
  };

  const setAsCoverImage = (idx) => {
    setForm((f) => {
      const list = [...(f.images || [])];
      const [chosen] = list.splice(idx, 1);
      return { ...f, images: [chosen, ...list] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const imagesList = form.images || [];
    const payload = {
      ...form,
      images: imagesList,
      image: imagesList[0] || form.image || "",
      price: Number(form.price) || 0,
      inclusions: form.inclusions || [],
    };

    try {
      if (product?.id || product?._id) {
        await productsApi.update(product.id || product._id, payload);
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
      <div className="bg-[#F9F7F2] rounded-2xl max-w-2xl w-full my-auto shadow-2xl border border-[#D4C3A5]/30">
        <div className="flex items-center justify-between p-5 border-b border-[#D4C3A5]/30 sticky top-0 bg-[#F9F7F2] rounded-t-2xl z-10">
          <div>
            <h3 className="font-display text-xl text-[#1A1F2C]">
              {product ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-[11px] text-[#1A1F2C]/60">
              Add multiple angle photos for product slider & detail view
            </p>
          </div>
          <button onClick={onClose} className="text-[#1A1F2C]/60 hover:text-[#1A1F2C]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Multi-angle Product Images Section */}
          <div className="bg-white p-4 rounded-xl border border-[#D4C3A5]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C]">
                  PRODUCT IMAGES (MULTIPLE ANGLES)
                </label>
                <p className="text-[11px] text-[#1A1F2C]/60">
                  Upload front, back, side & close-up shots. First image is the main cover.
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-[#D4C3A5]/20 text-[#1A1F2C] px-2.5 py-1 rounded-full">
                {(form.images?.length) || 0} image(s)
              </span>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
              {(form.images || []).map((img, idx) => (
                <div
                  key={idx}
                  className={`relative group aspect-[4/5] rounded-lg overflow-hidden bg-[#F0EDE5] border-2 transition-all ${
                    idx === 0
                      ? "border-[#4A5D4E] shadow-sm"
                      : "border-[#D4C3A5]/40 hover:border-[#1A1F2C]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Badges & Actions Overlay */}
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-[#4A5D4E] text-white text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider shadow">
                      COVER
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                    <div className="flex justify-between items-center w-full">
                      {idx !== 0 ? (
                        <button
                          type="button"
                          onClick={() => setAsCoverImage(idx)}
                          title="Set as cover image"
                          className="bg-white text-[#1A1F2C] p-1 rounded hover:bg-[#D4C3A5] text-[9px] font-bold flex items-center gap-0.5"
                        >
                          <Star size={10} className="fill-[#1A1F2C]" />
                        </button>
                      ) : <span />}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        title="Delete image"
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <span className="text-white text-[9px] font-medium text-center bg-black/60 rounded px-1">
                      Angle #{idx + 1}
                    </span>
                  </div>
                </div>
              ))}

              {/* Add image placeholder box */}
              <label className="aspect-[4/5] rounded-lg border-2 border-dashed border-[#D4C3A5] hover:border-[#1A1F2C] bg-[#F9F7F2] flex flex-col items-center justify-center p-2 text-center cursor-pointer transition">
                {uploading ? (
                  <Loader2 size={20} className="animate-spin text-[#1A1F2C]" />
                ) : (
                  <>
                    <Upload size={20} className="text-[#1A1F2C]/60 mb-1" />
                    <span className="text-[10px] font-bold text-[#1A1F2C] tracking-wider uppercase">
                      Upload Files
                    </span>
                    <span className="text-[8px] text-[#1A1F2C]/50">Select multiple</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* URL Input Form */}
            <div className="pt-2 flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 bg-white border border-[#D4C3A5]/60 rounded-lg px-3 py-2 text-[12px] focus:outline-none focus:border-[#1A1F2C]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddImageUrl(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-[#1A1F2C] text-[#F9F7F2] text-[11px] font-semibold px-4 py-2 rounded-lg hover:bg-[#2a3142] flex items-center gap-1"
              >
                <Plus size={14} /> Add Angle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
                PRODUCT NAME *
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
                PRICE (₹) *
              </label>
              <input
                name="price"
                type="number"
                required
                value={form.price}
                onChange={handleChange}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
                TYPE *
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
                CATEGORY *
              </label>
              <select
                name="category"
                required
                value={
                  form.category &&
                  ALL_CATEGORIES.some(
                    (c) => c.key === form.category && c.type === form.type
                  )
                    ? form.category
                    : form.category
                    ? "custom"
                    : ""
                }
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

              {(!ALL_CATEGORIES.some(
                (c) => c.key === form.category && c.type === form.type
              ) ||
                form.category === "") && (
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
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
                BADGE
              </label>
              <select
                name="badge"
                value={form.badge}
                onChange={handleChange}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              >
                <option value="">None</option>
                <option value="Best Seller">Best Seller</option>
                <option value="New Arrival">New Arrival</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
                GENDER FILTER
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              >
                <option value="all">All</option>
                <option value="him">For Him</option>
                <option value="her">For Her</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              rows={2}
              value={form.description}
              onChange={handleChange}
              className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C] resize-none"
            />
          </div>

          {/* Inclusions */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
              WHAT'S INSIDE (Inclusions)
            </label>
            <div className="flex gap-2">
              <input
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInclusion();
                  }
                }}
                placeholder="e.g. Quran, Prayer Mat, Attar..."
                className="flex-1 bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
              />
              <button
                type="button"
                onClick={addInclusion}
                className="bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-semibold px-5 rounded-lg hover:bg-[#2a3142]"
              >
                ADD
              </button>
            </div>
            {form.inclusions?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.inclusions.map((inc, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-[#D4C3A5]/20 text-[#1A1F2C] text-[12px] px-3 py-1.5 rounded-full"
                  >
                    {inc}
                    <button
                      type="button"
                      onClick={() => removeInclusion(i)}
                      className="text-[#1A1F2C]/50 hover:text-[#C5564A]"
                    >
                      ✕
                    </button>
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
              <label
                key={t.key}
                className="flex items-center gap-2 text-[12px] font-medium text-[#1A1F2C] cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={t.key}
                  checked={!!form[t.key]}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#1A1F2C]"
                />
                {t.label}
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#1A1F2C]/30 text-[#1A1F2C] text-[12px] tracking-[0.15em] font-semibold py-3.5 rounded-full hover:bg-[#1A1F2C]/5"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#1A1F2C] text-[#F9F7F2] text-[12px] tracking-[0.15em] font-semibold py-3.5 rounded-full hover:bg-[#2a3142] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "SAVING..." : "SAVE PRODUCT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
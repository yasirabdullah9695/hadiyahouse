import React, { useState } from "react";
import { Plus, Trash2, Edit3, Save, RefreshCw, Sparkles, Check, Tag } from "lucide-react";
import { SIGNATURE_BOX } from "@/lib/constants";

export const SIGNATURE_ITEMS_STORAGE_KEY = "hadiya_signature_box_custom_items";

export const SIGNATURE_CATEGORIES = [
  "Attar & Perfume",
  "Tasbeeh",
  "Miswak",
  "Topi (Prayer Cap)",
  "Prayer Mat",
  "Watch & Wallet",
  "Hijab & Accessories",
  "Calligraphy Frame",
  "Quran & Books",
  "General",
];

const DEFAULT_EXTENDED_ITEMS = [
  { name: "Royal Rose Attar (12ml)", price: 299, category: "Attar & Perfume", image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png" },
  { name: "Oud Al-Arabic Attar (6ml)", price: 499, category: "Attar & Perfume", image: "" },
  { name: "99 Beads Stone Tasbeeh", price: 199, category: "Tasbeeh", image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/c178ea7ae_generated_image.png" },
  { name: "Crystal Clear Tasbeeh", price: 249, category: "Tasbeeh", image: "" },
  { name: "Natural Olive Miswak", price: 99, category: "Miswak", image: "" },
  { name: "Sewn Velvet Topi", price: 149, category: "Topi (Prayer Cap)", image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/62da106ac_generated_image.png" },
  { name: "Turkish Soft Velvet Mat", price: 499, category: "Prayer Mat", image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/8b5930422_generated_2d3be97f.png" },
  { name: "Silk Padded Prayer Mat", price: 799, category: "Prayer Mat", image: "" },
  { name: "Custom Calligraphy Name Frame", price: 799, category: "Calligraphy Frame", image: "/calligraphy_frame_sample.jpg" },
  { name: "Gold Foil Acrylic Name Frame", price: 999, category: "Calligraphy Frame", image: "" },
  { name: "Luxury Quartz Watch", price: 599, category: "Watch & Wallet", image: "" },
  { name: "Leather Coin Wallet", price: 399, category: "Watch & Wallet", image: "" },
  { name: "Chiffon Hijab & Accessory Set", price: 249, category: "Hijab & Accessories", image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/032ee1fa3_generated_image.png" },
];

export function getSignatureBoxItems() {
  try {
    const saved = localStorage.getItem(SIGNATURE_ITEMS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // fallback to defaults
  }
  return DEFAULT_EXTENDED_ITEMS;
}

export function saveSignatureBoxItems(items) {
  try {
    localStorage.setItem(SIGNATURE_ITEMS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("signature-items-updated"));
  } catch (e) {
    console.error("Failed to save signature items:", e);
  }
}

export default function AdminSignatureItems() {
  const [items, setItems] = useState(() => getSignatureBoxItems());
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(SIGNATURE_CATEGORIES[0]);
  const [newItemImage, setNewItemImage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const price = Number(newItemPrice) || 0;
    const newItem = {
      name: newItemName.trim(),
      price,
      category: newItemCategory,
      image: newItemImage.trim(),
    };
    const updated = [newItem, ...items];
    setItems(updated);
    saveSignatureBoxItems(updated);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemImage("");
    triggerSuccess();
  };

  const handleDeleteItem = (index) => {
    if (!window.confirm(`Delete "${items[index]?.name}" from Signature Box?`)) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    saveSignatureBoxItems(updated);
    triggerSuccess();
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditPrice(items[index].price.toString());
  };

  const handleSaveEdit = (index) => {
    const price = Number(editPrice) || 0;
    const updated = items.map((item, i) => (i === index ? { ...item, price } : item));
    setItems(updated);
    saveSignatureBoxItems(updated);
    setEditingIndex(null);
    triggerSuccess();
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Reset signature box items to original defaults?")) return;
    setItems(DEFAULT_EXTENDED_ITEMS);
    saveSignatureBoxItems(DEFAULT_EXTENDED_ITEMS);
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-[#1A1F2C] text-[#F9F7F2] p-6 rounded-2xl border border-[#D4C3A5]/30 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-semibold text-[#D4C3A5] uppercase mb-1">
            <Sparkles size={13} /> DEDICATED SIGNATURE BOX MANAGER
          </div>
          <h2 className="font-display text-2xl text-[#F9F7F2]">Signature Box Particular Products & Categories</h2>
          <p className="text-[12px] text-[#F9F7F2]/70 mt-1 max-w-xl">
            Add specific products with their category and price. Users will be able to filter by category and pick exact items in the "Choose Your Hadiya Box" builder!
          </p>
        </div>
        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-[#D4C3A5] border border-[#D4C3A5]/40 px-4 py-2.5 rounded-full hover:bg-[#D4C3A5] hover:text-[#1A1F2C] transition-colors"
        >
          <RefreshCw size={13} /> RESET DEFAULTS
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-[13px] font-medium">
          <Check size={16} /> Saved! Particular products are now live in the Signature Box builder.
        </div>
      )}

      {/* Add New Particular Item Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#D4C3A5]/35 shadow-sm space-y-4">
        <h3 className="text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase flex items-center gap-2">
          <Plus size={14} className="text-[#4A5D4E]" /> Add Particular Item / Product to Category
        </h3>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">
              CATEGORY *
            </label>
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3 py-2 text-[13px] font-medium text-[#1A1F2C] focus:outline-none"
            >
              {SIGNATURE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">
              SPECIFIC PRODUCT NAME *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Rose Attar (12ml)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">
              PRICE (₹) *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 499"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-bold py-2.5 rounded-lg hover:bg-[#2a3142] transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} /> ADD ITEM
            </button>
          </div>

          <div className="sm:col-span-12">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">
              IMAGE URL (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. https://... photo link"
              value={newItemImage}
              onChange={(e) => setNewItemImage(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[12px] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>
        </form>
      </div>

      {/* Items List Table */}
      <div className="bg-white rounded-2xl border border-[#D4C3A5]/35 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#F0EDE5] border-b border-[#D4C3A5]/30 flex items-center justify-between">
          <span className="text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase flex items-center gap-2">
            <Tag size={14} /> Particular Signature Products ({items.length})
          </span>
          <span className="text-[11px] text-[#1A1F2C]/60">Packaging Box & Bag: FREE (₹0)</span>
        </div>

        <div className="divide-y divide-[#D4C3A5]/20">
          {items.map((item, index) => {
            const isEditing = editingIndex === index;
            return (
              <div
                key={index}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#F9F7F2]/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-[#F0EDE5] border border-[#D4C3A5]/30 flex-shrink-0" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-[#1A1F2C] text-[#D4C3A5] text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                  )}
                  <div>
                    <h4 className="font-medium text-[#1A1F2C] text-[14px]">{item.name}</h4>
                    <span className="text-[10px] text-[#4A5D4E] font-semibold bg-[#4A5D4E]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {item.category || "General"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#1A1F2C]">₹</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-24 bg-[#F9F7F2] border border-[#D4C3A5] rounded-md px-2 py-1 text-[13px] font-semibold text-[#1A1F2C] focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="bg-[#4A5D4E] text-white p-1.5 rounded-md hover:bg-[#3b4b3e]"
                        title="Save Price"
                      >
                        <Save size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#4A5D4E] bg-[#4A5D4E]/10 px-3 py-1 rounded-full">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => handleStartEdit(index)}
                        className="text-[#1A1F2C]/50 hover:text-[#1A1F2C] p-1.5 rounded-md hover:bg-[#F0EDE5]"
                        title="Edit Price"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="text-[#C5564A]/70 hover:text-[#C5564A] p-1.5 rounded-md hover:bg-[#C5564A]/10 transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

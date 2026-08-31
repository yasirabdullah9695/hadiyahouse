import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Save, RefreshCw, Sparkles, Check, Tag } from "lucide-react";
import { SIGNATURE_BOX } from "@/lib/constants";

export const SIGNATURE_ITEMS_STORAGE_KEY = "hadiya_signature_box_custom_items";

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
  return SIGNATURE_BOX.items;
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
  const [editingIndex, setEditingIndex] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const price = Number(newItemPrice) || 0;
    const updated = [...items, { name: newItemName.trim(), price }];
    setItems(updated);
    saveSignatureBoxItems(updated);
    setNewItemName("");
    setNewItemPrice("");
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
    setItems(SIGNATURE_BOX.items);
    saveSignatureBoxItems(SIGNATURE_BOX.items);
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
          <h2 className="font-display text-2xl text-[#F9F7F2]">Signature Box Items & Prices</h2>
          <p className="text-[12px] text-[#F9F7F2]/70 mt-1 max-w-xl">
            Add new items or update prices here. Changes automatically update live in the "Choose Your Hadiya Box" builder on the website!
          </p>
        </div>
        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] text-[#D4C3A5] border border-[#D4C3A5]/40 px-4 py-2.5 rounded-full hover:bg-[#D4C3A5] hover:text-[#1A1F2C] transition-colors"
        >
          <RefreshCw size={13} /> RESET TO DEFAULTS
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-[13px] font-medium">
          <Check size={16} /> Saved! Changes are now live on the website Signature Box.
        </div>
      )}

      {/* Add New Item Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#D4C3A5]/35 shadow-sm">
        <h3 className="text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase mb-4 flex items-center gap-2">
          <Plus size={14} className="text-[#4A5D4E]" /> Add New Item to Signature Box
        </h3>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
              ITEM NAME *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Calligraphy Frame, Luxury Watch, Perfume..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">
              PRICE (₹) *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 799"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-bold py-3 rounded-lg hover:bg-[#2a3142] transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus size={14} /> ADD ITEM
            </button>
          </div>
        </form>
      </div>

      {/* Items List Table */}
      <div className="bg-white rounded-2xl border border-[#D4C3A5]/35 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#F0EDE5] border-b border-[#D4C3A5]/30 flex items-center justify-between">
          <span className="text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase flex items-center gap-2">
            <Tag size={14} /> Current Signature Box Items ({items.length})
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
                  <span className="w-8 h-8 rounded-full bg-[#1A1F2C] text-[#D4C3A5] text-[11px] font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-[#1A1F2C] text-[15px]">{item.name}</h4>
                    <span className="text-[10px] text-[#1A1F2C]/50">Available in custom box builder</span>
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
                      <span className="text-[15px] font-bold text-[#4A5D4E] bg-[#4A5D4E]/10 px-3 py-1 rounded-full">
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

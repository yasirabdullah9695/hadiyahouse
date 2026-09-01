import React, { useState } from "react";
import { Plus, Trash2, Edit3, Save, RefreshCw, Sparkles, Check, Image as ImageIcon } from "lucide-react";
import { uploadApi } from "@/api/apiClient";

export const CIRCLE_CATEGORIES_STORAGE_KEY = "hadiya_circle_categories_custom";

export const DEFAULT_CIRCLE_CATEGORIES = [
  {
    id: "circle-1",
    name: "Gift Boxes",
    label: "Gift Boxes",
    to: "/shop?category=Gift+Boxes",
    image: "/signature_box_packaging.jpg",
  },
  {
    id: "circle-2",
    name: "Calligraphy",
    label: "Calligraphy",
    to: "/shop?category=Custom+Calligraphy+Frame",
    image: "/calligraphy_frame_sample.jpg",
  },
  {
    id: "circle-3",
    name: "Attars",
    label: "Attars & Perfumes",
    to: "/shop?category=Perfume+%26+Attar",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png",
  },
  {
    id: "circle-4",
    name: "Prayer Mats",
    label: "Prayer Mats",
    to: "/shop?category=Prayer+Mat",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/8b5930422_generated_2d3be97f.png",
  },
  {
    id: "circle-5",
    name: "Tasbeeh",
    label: "Tasbeeh & Beads",
    to: "/shop?category=Tasbeeh",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/c178ea7ae_generated_image.png",
  },
  {
    id: "circle-6",
    name: "Nikah",
    label: "Nikah Hampers",
    to: "/shop?category=Nikah",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/f976def70_generated_6a9962be.png",
  },
  {
    id: "circle-7",
    name: "Hajj & Umrah",
    label: "Hajj & Umrah",
    to: "/shop?category=Hajj",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/e94d9482f_generated_image.png",
  },
  {
    id: "circle-8",
    name: "Hijab & Caps",
    label: "Hijab & Caps",
    to: "/shop?category=Hijab+Kit",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/032ee1fa3_generated_image.png",
  },
];

export function getCircleCategories() {
  try {
    const saved = localStorage.getItem(CIRCLE_CATEGORIES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_CIRCLE_CATEGORIES;
}

export function saveCircleCategories(categories) {
  try {
    localStorage.setItem(CIRCLE_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("circle-categories-updated"));
  } catch (e) {
    console.error("Failed to save circle categories:", e);
  }
}

export default function AdminCircleCategories() {
  const [categories, setCategories] = useState(() => getCircleCategories());
  const [newLabel, setNewLabel] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newLink, setNewLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editObj, setEditObj] = useState({ label: "", image: "", to: "" });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      const url = res.file_url || res.url;
      if (isEdit) {
        setEditObj((prev) => ({ ...prev, image: url }));
      } else {
        setNewImage(url);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (isEdit) {
          setEditObj((prev) => ({ ...prev, image: evt.target.result }));
        } else {
          setNewImage(evt.target.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const labelStr = newLabel.trim();
    const targetLink = newLink.trim() || `/shop?category=${encodeURIComponent(labelStr)}`;
    const newCat = {
      id: `circle-cat-${Date.now()}`,
      name: labelStr,
      label: labelStr,
      to: targetLink,
      image: newImage.trim() || "/signature_box_packaging.jpg",
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    saveCircleCategories(updated);

    setNewLabel("");
    setNewImage("");
    setNewLink("");
    triggerSuccess();
  };

  const handleDeleteCategory = (index) => {
    if (!window.confirm(`Delete circle category "${categories[index]?.label}"?`)) return;
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    saveCircleCategories(updated);
    triggerSuccess();
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditObj({
      label: categories[index].label,
      image: categories[index].image,
      to: categories[index].to,
    });
  };

  const handleSaveEdit = (index) => {
    const updated = categories.map((cat, i) =>
      i === index ? { ...cat, label: editObj.label, image: editObj.image, to: editObj.to } : cat
    );
    setCategories(updated);
    saveCircleCategories(updated);
    setEditingIndex(null);
    triggerSuccess();
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Reset circle categories to original defaults?")) return;
    setCategories(DEFAULT_CIRCLE_CATEGORIES);
    saveCircleCategories(DEFAULT_CIRCLE_CATEGORIES);
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
            <Sparkles size={13} /> CIRCLE CATEGORIES MANAGER
          </div>
          <h2 className="font-display text-2xl text-[#F9F7F2]">Top Circular Categories Scroll Bar</h2>
          <p className="text-[12px] text-[#F9F7F2]/70 mt-1 max-w-xl">
            Add new circular categories or update images & labels. Changes automatically update live in the circular categories scroll bar under the Navbar on your website!
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
          <Check size={16} /> Saved! Circle categories updated live on the website.
        </div>
      )}

      {/* Add New Circle Category Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#D4C3A5]/35 shadow-sm space-y-4">
        <h3 className="text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase flex items-center gap-2">
          <Plus size={14} className="text-[#4A5D4E]" /> Add New Circle Category
        </h3>

        <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">
              CATEGORY NAME / LABEL *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Calligraphy Art, Attars..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">
              IMAGE (UPLOAD OR PASTE URL)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Paste image link or upload"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[12px] focus:outline-none focus:border-[#1A1F2C]"
              />
              <label className="bg-[#1A1F2C] text-[#F9F7F2] text-[10px] font-bold px-3 py-2 rounded-lg cursor-pointer hover:bg-[#2a3142] flex items-center gap-1 flex-shrink-0">
                <ImageIcon size={12} /> {uploading ? "..." : "UPLOAD"}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" />
              </label>
            </div>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-bold py-2.5 rounded-lg hover:bg-[#2a3142] transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} /> ADD CIRCLE
            </button>
          </div>
        </form>
      </div>

      {/* Circle Categories List */}
      <div className="bg-white rounded-2xl border border-[#D4C3A5]/35 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#F0EDE5] border-b border-[#D4C3A5]/30 flex items-center justify-between">
          <span className="text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase">
            Active Circle Categories ({categories.length})
          </span>
        </div>

        <div className="divide-y divide-[#D4C3A5]/20">
          {categories.map((cat, index) => {
            const isEditing = editingIndex === index;
            return (
              <div key={cat.id || index} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-[#F9F7F2]/60 transition-colors">
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#F0EDE5] border-2 border-[#D4C3A5] flex-shrink-0">
                    <img src={isEditing ? editObj.image : cat.image} alt={cat.label} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editObj.label}
                        onChange={(e) => setEditObj({ ...editObj, label: e.target.value })}
                        className="bg-[#F9F7F2] border border-[#D4C3A5] rounded px-2 py-1 text-[13px] font-bold text-[#1A1F2C]"
                      />
                    ) : (
                      <h4 className="font-bold text-[#1A1F2C] text-[14px]">{cat.label}</h4>
                    )}
                    <p className="text-[10px] text-[#1A1F2C]/50 truncate max-w-xs">{isEditing ? editObj.to : cat.to}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <label className="bg-[#1A1F2C] text-[#F9F7F2] text-[10px] font-bold px-2.5 py-1.5 rounded cursor-pointer">
                        CHANGE PHOTO
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
                      </label>
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="bg-[#4A5D4E] text-white p-1.5 rounded-md hover:bg-[#3b4b3e]"
                        title="Save Changes"
                      >
                        <Save size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(index)}
                      className="text-[#1A1F2C]/60 hover:text-[#1A1F2C] p-1.5 rounded-md hover:bg-[#F0EDE5] flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Edit3 size={14} /> EDIT
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteCategory(index)}
                    className="text-[#C5564A]/70 hover:text-[#C5564A] p-1.5 rounded-md hover:bg-[#C5564A]/10 transition-colors"
                    title="Delete Category"
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

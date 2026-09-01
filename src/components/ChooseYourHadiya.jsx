import React, { useState, useEffect, useMemo } from "react";
import { Check, Plus, Minus, ArrowRight, Sparkles, ShoppingBag, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion } from "framer-motion";
import { SIGNATURE_BOX } from "@/lib/constants";
import { productsApi } from "@/api/apiClient";
import OrderModal from "@/components/OrderModal";
import { getSignatureBoxItems } from "@/components/admin/AdminSignatureItems";

const PREMIUM_EASE = [0.22, 1, 0.36, 1];
const PACKAGING_IMG = "/signature_box_packaging.jpg";

export default function ChooseYourHadiya() {
  const [dbProducts, setDbProducts] = useState([]);
  const [signatureItems, setSignatureItems] = useState(() => getSignatureBoxItems());
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItems, setSelectedItems] = useState({});
  const [showOrder, setShowOrder] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSignatureItems(getSignatureBoxItems());
    };
    window.addEventListener("signature-items-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("signature-items-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    productsApi
      .list("-createdAt", 200)
      .then((data) => {
        const visible = (data || []).filter((p) => !p.hidden);
        setDbProducts(visible);
      })
      .catch(() => setDbProducts([]));
  }, []);

  const allAvailableItems = useMemo(() => {
    const individualDbItems = dbProducts.filter(
      (p) => p.type === "Individual Item" || p.type === "Signature Box Item" || p.category === "Signature Box Items"
    );

    const mergedMap = new Map();

    signatureItems.forEach((i, idx) => {
      mergedMap.set(i.name, {
        id: `sig-${idx}`,
        name: i.name,
        price: i.price || 0,
        category: i.category || "General",
        image: i.image || "",
        description: i.description || "",
      });
    });

    individualDbItems.forEach((p) => {
      if (!mergedMap.has(p.name)) {
        mergedMap.set(p.name, {
          id: p.id || p._id || p.name,
          name: p.name,
          price: p.price || 0,
          category: p.category || "General",
          image: p.image || "",
          description: p.description || "",
        });
      }
    });

    return Array.from(mergedMap.values());
  }, [dbProducts, signatureItems]);

  const categories = useMemo(() => {
    const set = new Set(allAvailableItems.map((item) => item.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [allAvailableItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return allAvailableItems;
    return allAvailableItems.filter((i) => i.category === activeCategory);
  }, [allAvailableItems, activeCategory]);

  const totalCount = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);

  const totalPrice = Object.entries(selectedItems).reduce((sum, [itemName, qty]) => {
    const itemObj = allAvailableItems.find((i) => i.name === itemName);
    return sum + (itemObj ? itemObj.price : 0) * qty;
  }, 0);

  const addItem = (name) => setSelectedItems((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  const removeItem = (name) =>
    setSelectedItems((prev) => {
      if ((prev[name] || 0) <= 1) {
        const c = { ...prev };
        delete c[name];
        return c;
      }
      return { ...prev, [name]: prev[name] - 1 };
    });

  const canOrder = totalCount > 0;

  const formattedSelections = Object.entries(selectedItems)
    .filter(([_, qty]) => qty > 0)
    .map(([name, qty]) => {
      const item = allAvailableItems.find((i) => i.name === name);
      return `${qty}x ${name} (₹${item ? item.price * qty : 0})`;
    })
    .join(", ");

  const presetNotes = `Custom Hadiya Box (${totalCount} items): ${formattedSelections}. (Total: ₹${totalPrice})`;
  const virtualProduct = {
    name: SIGNATURE_BOX.name,
    price: totalPrice,
    type: "Gift Box",
    category: "Signature Box",
    image: PACKAGING_IMG,
  };

  const scrollCats = (dir) => {
    const el = document.getElementById("cat-scroll");
    if (el) el.scrollBy({ left: dir === "left" ? -180 : 180, behavior: "smooth" });
  };

  return (
    <section className="bg-[#121620] py-16 lg:py-24 border-y border-[#D4C3A5]/25 text-[#F9F7F2] relative">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 space-y-10">

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] font-semibold text-[#D4C3A5] bg-[#D4C3A5]/10 border border-[#D4C3A5]/20 px-3.5 py-1.5 rounded-full mb-3 uppercase">
            <Sparkles size={13} strokeWidth={1.5} /> LUXURY CUSTOM GIFT BOX BUILDER
          </div>
          <h2 className="font-display text-3xl lg:text-4xl text-[#F9F7F2] tracking-tight">Build Your Own Hadiya Box</h2>
          <p className="text-[14px] text-[#F9F7F2]/60 mt-2">
            Select specific products from each category below. Click any item to see details & image. Prices update live!
          </p>
        </div>

        {/* 2-COLUMN LAYOUT (Products Grid + Price Calculator) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: PREMIUM_EASE }}
          className="grid lg:grid-cols-12 gap-5 items-stretch"
        >

          {/* COLUMN 1: Category Scroll & Products Grid (8 cols) */}
          <div className="lg:col-span-8 bg-[#181E2C] rounded-2xl border border-[#D4C3A5]/30 flex flex-col overflow-hidden">
            
            {/* Category Scroll Header */}
            <div className="px-4 pt-4 pb-3 border-b border-[#D4C3A5]/20 flex items-center gap-3">
              <button onClick={() => scrollCats("left")} className="w-7 h-7 rounded-full bg-[#121620] border border-[#D4C3A5]/30 text-[#D4C3A5] flex items-center justify-center hover:border-[#D4C3A5] flex-shrink-0">
                <ChevronLeft size={14} />
              </button>
              <div
                id="cat-scroll"
                className="flex items-center gap-2 overflow-x-auto flex-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] font-semibold px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                      activeCategory === cat
                        ? "bg-[#D4C3A5] text-[#121620] font-bold shadow-md"
                        : "bg-[#121620] border border-[#D4C3A5]/25 text-[#F9F7F2]/70 hover:border-[#D4C3A5]/60"
                    }`}
                  >
                    {cat === "All" ? "✨ All Items" : cat}
                  </button>
                ))}
              </div>
              <button onClick={() => scrollCats("right")} className="w-7 h-7 rounded-full bg-[#121620] border border-[#D4C3A5]/30 text-[#D4C3A5] flex items-center justify-center hover:border-[#D4C3A5] flex-shrink-0">
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Products Grid (scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" style={{ maxHeight: "480px" }}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredItems.map((item) => {
                  const qty = selectedItems[item.name] || 0;
                  const isSelected = qty > 0;
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col justify-between p-3 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#1C2333] border-[#D4C3A5] shadow-md shadow-[#D4C3A5]/10"
                          : "bg-[#121620] border-[#D4C3A5]/20 hover:border-[#D4C3A5]/45"
                      }`}
                    >
                      {/* Product image — clickable for preview */}
                      <div
                        className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-[#181E2C] cursor-pointer relative group/img"
                        onClick={() => setPreviewItem(item)}
                      >
                        {item.image ? (
                          <>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all duration-300 flex items-center justify-center">
                              <ZoomIn size={18} className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#D4C3A5]/40 italic">
                            Tap to view
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span
                            className={`text-[12px] font-medium leading-tight cursor-pointer hover:underline ${isSelected ? "text-[#D4C3A5]" : "text-[#F9F7F2]"}`}
                            onClick={() => setPreviewItem(item)}
                          >
                            {item.name}
                          </span>
                          {isSelected && (
                            <span className="bg-[#D4C3A5] text-[#121620] text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                              <Check size={9} strokeWidth={3} /> {qty}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-[#D4C3A5]/70 font-medium truncate max-w-[90px]">
                            {item.category}
                          </span>
                          <span className="text-[12px] text-[#D4C3A5] font-bold">₹{item.price}</span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#D4C3A5]/15">
                        {isSelected ? (
                          <div className="flex items-center justify-between">
                            <button onClick={() => removeItem(item.name)} className="w-6 h-6 rounded-md bg-[#121620] border border-[#D4C3A5]/30 text-[#D4C3A5] flex items-center justify-center">
                              <Minus size={11} strokeWidth={2.5} />
                            </button>
                            <span className="text-[11px] font-bold text-[#D4C3A5]">₹{item.price * qty}</span>
                            <button onClick={() => addItem(item.name)} className="w-6 h-6 rounded-md bg-[#D4C3A5] text-[#121620] flex items-center justify-center font-bold">
                              <Plus size={11} strokeWidth={2.5} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(item.name)}
                            className="w-full text-[11px] font-semibold py-1.5 rounded-lg border border-[#D4C3A5]/30 text-[#D4C3A5] hover:bg-[#D4C3A5] hover:text-[#121620] transition-all flex items-center justify-center gap-1"
                          >
                            <Plus size={11} strokeWidth={2.5} /> ADD
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* COLUMN 2: Live Price Calculator & Selection Breakdown (4 cols) */}
          <div className="lg:col-span-4 bg-[#181E2C] rounded-2xl border border-[#D4C3A5]/30 flex flex-col p-4 space-y-4">
            
            <div className="pb-3 border-b border-[#D4C3A5]/20">
              <p className="text-[10px] tracking-[0.18em] font-bold text-[#D4C3A5] uppercase">Price Calculator</p>
              <p className="text-[11px] text-[#F9F7F2]/50 mt-0.5">
                {totalCount === 0 ? "Select items to build your box" : `${totalCount} item${totalCount !== 1 ? "s" : ""} selected`}
              </p>
            </div>

            {/* Selected Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar" style={{ maxHeight: "300px" }}>
              {totalCount === 0 ? (
                <div className="h-full min-h-[100px] flex items-center justify-center text-[12px] text-[#F9F7F2]/30 italic text-center">
                  ← Choose items from the product grid
                </div>
              ) : (
                Object.entries(selectedItems).map(([name, qty]) => {
                  const item = allAvailableItems.find((i) => i.name === name);
                  const lineTotal = item ? item.price * qty : 0;
                  return (
                    <div key={name} className="flex items-center justify-between bg-[#121620] border border-[#D4C3A5]/20 rounded-lg p-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="bg-[#D4C3A5] text-[#121620] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{qty}</span>
                        <div className="min-w-0">
                          <p className="text-[12px] text-[#F9F7F2] truncate font-medium">{name}</p>
                          <p className="text-[9px] text-[#D4C3A5]/60">{item?.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-1">
                        <span className="text-[11px] text-[#D4C3A5] font-bold">₹{lineTotal}</span>
                        <button onClick={() => removeItem(name)} className="text-[#F9F7F2]/40 hover:text-[#C5564A] text-[10px]">✕</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Total & Order Button */}
            <div className="border-t border-[#D4C3A5]/20 pt-4 space-y-3 mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] tracking-[0.15em] text-[#D4C3A5] font-semibold uppercase">Total Box Price</p>
                  <p className="font-heading text-2xl font-bold text-[#D4C3A5] leading-none mt-0.5">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${canOrder ? "bg-[#D4C3A5] text-[#121620]" : "bg-[#D4C3A5]/15 text-[#D4C3A5]"}`}>
                  {totalCount} ITEMS
                </span>
              </div>
              <button
                onClick={() => canOrder && setShowOrder(true)}
                disabled={!canOrder}
                className="w-full flex items-center justify-center gap-2 bg-[#D4C3A5] text-[#121620] text-[12px] tracking-[0.15em] font-bold py-3.5 rounded-full hover:bg-[#e2d3b7] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
              >
                {canOrder ? "ORDER NOW" : "SELECT ITEMS"} <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>

          </div>

        </motion.div>

      </div>

      {/* Floating Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#181E2C]/95 backdrop-blur-lg border-t border-[#D4C3A5]/30 px-5 py-3 shadow-2xl flex items-center justify-between">
        <div>
          <p className="text-[9px] tracking-[0.15em] text-[#D4C3A5] font-semibold uppercase">Total ({totalCount} items)</p>
          <p className="font-heading text-2xl font-bold text-[#D4C3A5]">₹{totalPrice.toLocaleString("en-IN")}</p>
        </div>
        <button
          onClick={() => canOrder && setShowOrder(true)}
          disabled={!canOrder}
          className="inline-flex items-center gap-2 bg-[#D4C3A5] text-[#121620] text-[11px] tracking-[0.15em] font-bold px-6 py-3 rounded-full hover:bg-[#e2d3b7] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {canOrder ? "ORDER NOW" : "SELECT ITEMS"} <ArrowRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* ITEM DETAIL PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPreviewItem(null)}>
          <div
            className="bg-[#181E2C] border border-[#D4C3A5]/40 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            {previewItem.image && (
              <div className="aspect-square bg-[#121620] overflow-hidden">
                <img
                  src={previewItem.image}
                  alt={previewItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; }}
                />
              </div>
            )}

            {/* Details */}
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] tracking-[0.15em] font-bold text-[#D4C3A5]/70 uppercase">{previewItem.category}</p>
                  <h3 className="font-display text-xl text-[#F9F7F2] mt-1">{previewItem.name}</h3>
                </div>
                <button onClick={() => setPreviewItem(null)} className="text-[#F9F7F2]/50 hover:text-[#F9F7F2] flex-shrink-0 mt-1">
                  <X size={20} />
                </button>
              </div>

              {previewItem.description && (
                <p className="text-[13px] text-[#F9F7F2]/60 leading-relaxed">{previewItem.description}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#D4C3A5]/20">
                <span className="font-heading text-2xl font-bold text-[#D4C3A5]">₹{previewItem.price}</span>
                <button
                  onClick={() => { addItem(previewItem.name); setPreviewItem(null); }}
                  className="bg-[#D4C3A5] text-[#121620] text-[11px] tracking-[0.15em] font-bold px-5 py-2.5 rounded-full hover:bg-[#e2d3b7] transition-all flex items-center gap-1.5"
                >
                  <Plus size={13} strokeWidth={2.5} /> ADD TO BOX
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrder && (
        <OrderModal product={virtualProduct} presetNotes={presetNotes} onClose={() => setShowOrder(false)} />
      )}
    </section>
  );
}
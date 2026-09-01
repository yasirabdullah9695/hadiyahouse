import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Tag, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/api/apiClient";
import { ALL_CATEGORIES } from "@/lib/constants";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(initialCat);

  useEffect(() => {
    productsApi
      .list("-createdAt", 200)
      .then((data) => setProducts((data || []).filter((p) => !p.hidden)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveFilter(cat);
  }, [searchParams]);

  // Dynamic Categories from DB + Constants
  const categories = useMemo(() => {
    const defaultKeys = ALL_CATEGORIES.map((c) => c.key);
    const dbKeys = products.map((p) => p.category).filter(Boolean);
    const combinedSet = new Set([...defaultKeys, ...dbKeys]);
    return Array.from(combinedSet).sort();
  }, [products]);

  const quickFilterPills = useMemo(() => {
    return [
      { id: "All", label: "✨ ALL PRODUCTS" },
      { id: "Gift Boxes", label: "🎁 GIFT BOXES" },
      { id: "Custom Calligraphy Frame", label: "🎨 CALLIGRAPHY FRAMES" },
      { id: "Perfume & Attar", label: "🌹 ATTARS & PERFUMES" },
      { id: "Prayer Mat", label: "🕌 PRAYER MATS" },
      { id: "Tasbeeh", label: "📿 TASBEEH & BEADS" },
      { id: "Individual Items", label: "🛍️ INDIVIDUAL ITEMS" },
      { id: "Best Seller", label: "★ BEST SELLERS" },
      ...categories
        .filter((c) => !["Custom Calligraphy Frame", "Perfume & Attar", "Prayer Mat", "Tasbeeh"].includes(c))
        .map((c) => ({ id: c, label: c.toUpperCase() })),
    ];
  }, [categories]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeFilter === "All") return list;
    if (activeFilter === "Best Seller") return list.filter((p) => p.best_seller || p.badge === "Best Seller");
    if (activeFilter === "Gift Boxes") return list.filter((p) => (p.type || "Gift Box") === "Gift Box");
    if (activeFilter === "Individual Items") return list.filter((p) => p.type === "Individual Item");
    if (activeFilter === "Signature Box Items") return list.filter((p) => p.type === "Signature Box Item" || p.category === "Signature Box Items");
    return list.filter((p) => p.category === activeFilter);
  }, [products, activeFilter]);

  const handleSelectFilter = (filterId) => {
    setActiveFilter(filterId);
    if (filterId === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: filterId });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />

      {/* Header Banner */}
      <section className="py-12 lg:py-16 border-b border-[#D4C3A5]/30 bg-[#1A1F2C] text-[#F9F7F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] font-semibold text-[#D4C3A5] bg-[#D4C3A5]/10 border border-[#D4C3A5]/20 px-3.5 py-1.5 rounded-full mb-3 uppercase">
            <Sparkles size={13} strokeWidth={1.5} /> HADIYA HOUSE LUXURY COLLECTION
          </div>
          <h1 className="font-display text-3xl lg:text-5xl text-[#F9F7F2] tracking-tight">The Complete Collection</h1>
          <p className="text-[13px] sm:text-[14px] text-[#F9F7F2]/70 max-w-xl mx-auto mt-2">
            Explore curated Islamic hampers, custom Arabic calligraphy framing, artisan attars & spiritual essentials.
          </p>
        </div>
      </section>

      {/* HORIZONTAL QUICK FILTER PILLS BAR (Hadiyah Gifting Style) */}
      <section className="sticky top-20 z-40 bg-[#F0EDE5]/95 backdrop-blur-md border-b border-[#D4C3A5]/30 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {quickFilterPills.map((pill) => {
              const isActive = activeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => handleSelectFilter(pill.id)}
                  className={`text-[10.5px] tracking-[0.12em] font-bold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "bg-[#1A1F2C] text-[#D4C3A5] shadow-md border border-[#D4C3A5]/40"
                      : "bg-white/80 border border-[#D4C3A5]/30 text-[#1A1F2C]/80 hover:border-[#1A1F2C]/50 hover:bg-white"
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D4C3A5]/25">
            <div>
              <h2 className="font-display text-2xl text-[#1A1F2C]">
                {activeFilter === "All" ? "All Products" : activeFilter}
              </h2>
              <p className="text-[12px] text-[#1A1F2C]/50 mt-0.5">
                Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            {activeFilter !== "All" && (
              <button
                onClick={() => handleSelectFilter("All")}
                className="text-[11px] tracking-[0.15em] font-semibold text-[#4A5D4E] hover:underline flex items-center gap-1"
              >
                RESET FILTERS <X size={13} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-xl bg-[#F0EDE5] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#D4C3A5]/40">
              <p className="font-display text-2xl text-[#1A1F2C]/40 mb-2">No Products Found</p>
              <p className="text-[13px] text-[#1A1F2C]/50 mb-6">There are no items listed in "{activeFilter}" currently.</p>
              <button
                onClick={() => handleSelectFilter("All")}
                className="bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-semibold px-6 py-2.5 rounded-full"
              >
                VIEW ALL PRODUCTS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
              {filtered.map((p, i) => (
                <ProductCard key={p.id || p._id || i} product={p} index={i} />
              ))}
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
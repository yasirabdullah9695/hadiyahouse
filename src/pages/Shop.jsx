import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/api/apiClient";
import { ALL_CATEGORIES } from "@/lib/constants";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(initialCat);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  // Combine default ALL_CATEGORIES with any custom categories from products database
  const categories = useMemo(() => {
    const defaultKeys = ALL_CATEGORIES.map((c) => c.key);
    const dbKeys = products.map((p) => p.category).filter(Boolean);
    const combinedSet = new Set([...defaultKeys, ...dbKeys]);
    return Array.from(combinedSet).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeFilter === "All") return list;
    if (activeFilter === "Best Seller") return list.filter((p) => p.best_seller || p.badge === "Best Seller");
    if (activeFilter === "Gift Boxes") return list.filter((p) => (p.type || "Gift Box") === "Gift Box");
    if (activeFilter === "Individual Items") return list.filter((p) => p.type === "Individual Item");
    if (activeFilter === "Signature Box Items") return list.filter((p) => p.type === "Signature Box Item" || p.category === "Signature Box Items");
    return list.filter((p) => p.category === activeFilter);
  }, [products, activeFilter]);

  const typeFilters = ["All", "Gift Boxes", "Individual Items", "Signature Box Items", "Best Seller"];

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] tracking-[0.2em] font-semibold text-[#1A1F2C] mb-3 uppercase">SHOP BY TYPE</h3>
        <div className="space-y-1">
          {typeFilters.map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setMobileFiltersOpen(false);
              }}
              className={`block w-full text-left text-[12px] tracking-[0.05em] font-medium px-3 py-2 rounded-lg transition-colors ${
                activeFilter === f ? "bg-[#1A1F2C] text-[#F9F7F2] font-semibold" : "text-[#1A1F2C]/75 hover:bg-[#D4C3A5]/20"
              }`}
            >
              {f === "Best Seller" ? "★ Best Seller" : f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] tracking-[0.2em] font-semibold text-[#1A1F2C] mb-3 uppercase">ALL CATEGORIES</h3>
        <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setMobileFiltersOpen(false);
              }}
              className={`block w-full text-left text-[12px] tracking-[0.05em] font-medium px-3 py-2 rounded-lg transition-colors ${
                activeFilter === cat ? "bg-[#1A1F2C] text-[#F9F7F2] font-semibold" : "text-[#1A1F2C]/75 hover:bg-[#D4C3A5]/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />

      <section className="py-10 lg:py-14 border-b border-[#D4C3A5]/30 bg-[#F0EDE5]/50">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 text-center">
          <p className="text-[10px] tracking-[0.3em] font-semibold text-[#4A5D4E] mb-3 uppercase">THE COLLECTION</p>
          <h1 className="font-display text-4xl lg:text-5xl text-[#1A1F2C] tracking-tight">
            {activeFilter !== "All" ? activeFilter : "Shop All Gifts"}
          </h1>
          <p className="text-[14px] text-[#1A1F2C]/60 mt-4 max-w-xl mx-auto">
            Browse our full range of premium Islamic hampers, calligraphy frames, and individual gift items.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">

          {/* Top Bar with Category Dropdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-[#D4C3A5]/35 shadow-sm">
            <div className="flex items-center gap-3">
              <Tag size={16} className="text-[#4A5D4E]" />
              <span className="text-[12px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase">
                Category Filter:
              </span>
              
              {/* Category Select Dropdown Box */}
              <div className="relative inline-block">
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="appearance-none bg-[#F0EDE5] border border-[#D4C3A5]/50 text-[#1A1F2C] text-[12px] font-semibold pl-4 pr-10 py-2 rounded-full focus:outline-none focus:border-[#1A1F2C] cursor-pointer"
                >
                  <option value="All">✨ All Categories & Items</option>
                  <optgroup label="TYPES">
                    {typeFilters.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="CATEGORIES">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown size={14} className="absolute right-3 top.1/2 -translate-y-1/2 text-[#1A1F2C]/60 pointer-events-none" />
              </div>
            </div>

            {/* Active Filter Clear & Item Count */}
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-[#1A1F2C]/60 font-medium">
                Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </span>
              {activeFilter !== "All" && (
                <button
                  onClick={() => setActiveFilter("All")}
                  className="flex items-center gap-1 text-[11px] tracking-[0.1em] font-bold text-[#C5564A] hover:underline bg-[#C5564A]/10 px-3 py-1 rounded-full"
                >
                  Clear Filter <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="sticky top-24 bg-white p-5 rounded-2xl border border-[#D4C3A5]/35 shadow-sm">
                <FilterContent />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="aspect-[4/5] rounded-xl bg-[#F0EDE5] animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-[#D4C3A5]/30">
                  <p className="text-[#1A1F2C]/60 text-sm font-medium">No products found under "{activeFilter}".</p>
                  <button
                    onClick={() => setActiveFilter("All")}
                    className="mt-4 inline-flex items-center gap-2 bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-semibold px-6 py-2.5 rounded-full"
                  >
                    VIEW ALL PRODUCTS
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id || p._id || i} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
import React, { useState, useEffect, useMemo } from "react";
import { Search, X, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { productsApi } from "@/api/apiClient";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      productsApi
        .list("-createdAt", 200)
        .then((data) => setProducts((data || []).filter((p) => !p.hidden)))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-in fade-in duration-200">
      <div
        className="bg-[#181E2C] border border-[#D4C3A5]/40 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-[#F9F7F2]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-[#D4C3A5]/20 flex items-center gap-3 bg-[#121620]">
          <Search size={20} className="text-[#D4C3A5] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gift boxes, attars, mats, calligraphy..."
            className="w-full bg-transparent text-[14px] sm:text-[16px] text-[#F9F7F2] placeholder:text-[#F9F7F2]/40 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#F9F7F2]/50 hover:text-white p-1">
              <X size={16} />
            </button>
          )}
          <button onClick={onClose} className="text-[#D4C3A5] hover:underline text-[12px] font-bold px-2 py-1 flex-shrink-0">
            CANCEL
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-[12px] text-[#F9F7F2]/50 space-y-3">
              <p>Type to search products across Auren collection</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["Nikah", "Attar", "Prayer Mat", "Calligraphy", "Tasbeeh"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-[10px] tracking-[0.1em] font-semibold bg-[#121620] border border-[#D4C3A5]/30 px-3 py-1 rounded-full text-[#D4C3A5] hover:bg-[#D4C3A5] hover:text-[#121620] transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="py-8 text-center text-[13px] text-[#D4C3A5]/60">Searching products...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display text-xl text-[#F9F7F2]/50 mb-1">No products found for "{query}"</p>
              <p className="text-[12px] text-[#F9F7F2]/40">Try searching for "Attar", "Mat", "Gift Box" or "Calligraphy"</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] tracking-[0.18em] font-bold text-[#D4C3A5] uppercase mb-2">
                FOUND {filtered.length} PRODUCT{filtered.length !== 1 ? "S" : ""}
              </p>
              {filtered.map((product) => (
                <Link
                  key={product.id || product._id}
                  to={`/product/${product.id || product._id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[#121620] border border-[#D4C3A5]/20 hover:border-[#D4C3A5]/60 transition-all group"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#181E2C] overflow-hidden flex-shrink-0 border border-[#D4C3A5]/20">
                    <img
                      src={product.image || "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] tracking-[0.15em] font-bold text-[#D4C3A5] uppercase block truncate">
                      {product.category || "General"}
                    </span>
                    <h4 className="font-display text-[14px] text-[#F9F7F2] truncate group-hover:text-[#D4C3A5] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[12px] font-bold text-[#D4C3A5] mt-0.5">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-[#D4C3A5] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

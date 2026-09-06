import React, { useState, useEffect } from "react";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import OrderModal from "@/components/OrderModal";

const WISHLIST_STORAGE_KEY = "dar_ul_hadaya_wishlist_items";

export function getWishlist() {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [];
}

export function toggleWishlist(product) {
  try {
    const current = getWishlist();
    const productId = product.id || product._id;
    const exists = current.some((p) => (p.id || p._id) === productId);
    let updated;
    if (exists) {
      updated = current.filter((p) => (p.id || p._id) !== productId);
    } else {
      updated = [product, ...current];
    }
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlist-updated"));
    return !exists;
  } catch (e) {
    return false;
  }
}

export default function WishlistDrawer({ isOpen, onClose }) {
  const [items, setItems] = useState(() => getWishlist());
  const [selectedOrderProduct, setSelectedOrderProduct] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setItems(getWishlist());
    window.addEventListener("wishlist-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleRemove = (productId) => {
    const updated = items.filter((p) => (p.id || p._id) !== productId);
    setItems(updated);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#181E2C] border-l border-[#D4C3A5]/30 shadow-2xl text-[#F9F7F2] flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#D4C3A5]/20 flex items-center justify-between bg-[#121620]">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-[#C5564A] fill-[#C5564A]" />
            <h3 className="font-display text-lg text-[#F9F7F2]">Your Saved Wishlist</h3>
            <span className="bg-[#D4C3A5] text-[#121620] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button onClick={onClose} className="text-[#F9F7F2]/50 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#121620] border border-[#D4C3A5]/30 flex items-center justify-center mx-auto mb-2 text-[#D4C3A5]">
                <Heart size={28} strokeWidth={1.5} />
              </div>
              <p className="font-display text-xl text-[#F9F7F2]/60">Your Wishlist is Empty</p>
              <p className="text-[12px] text-[#F9F7F2]/40 max-w-xs mx-auto">
                Tap the heart icon on any hamper or item to save it for later!
              </p>
              <button
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-2 bg-[#D4C3A5] text-[#121620] text-[11px] tracking-[0.15em] font-bold px-6 py-3 rounded-full hover:bg-[#e2d3b7]"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            items.map((product) => (
              <div
                key={product.id || product._id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#121620] border border-[#D4C3A5]/20 hover:border-[#D4C3A5]/50 transition-all"
              >
                <Link
                  to={`/product/${product.id || product._id}`}
                  onClick={onClose}
                  className="w-16 h-16 rounded-lg bg-[#181E2C] overflow-hidden flex-shrink-0 border border-[#D4C3A5]/20"
                >
                  <img
                    src={product.image || "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png";
                    }}
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] tracking-[0.15em] font-bold text-[#D4C3A5] uppercase block truncate">
                    {product.category || "General"}
                  </span>
                  <Link
                    to={`/product/${product.id || product._id}`}
                    onClick={onClose}
                    className="font-display text-[14px] text-[#F9F7F2] truncate hover:text-[#D4C3A5] block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-[12px] font-bold text-[#D4C3A5] mt-0.5">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRemove(product.id || product._id)}
                    className="text-[#F9F7F2]/40 hover:text-[#C5564A] transition-colors p-1"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    onClick={() => setSelectedOrderProduct(product)}
                    className="bg-[#D4C3A5] text-[#121620] text-[9.5px] font-bold px-3 py-1.5 rounded-full hover:bg-[#e2d3b7] flex items-center gap-1"
                  >
                    ORDER NOW
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D4C3A5]/20 bg-[#121620] text-center">
          <p className="text-[11px] text-[#F9F7F2]/50">
            Items saved in your browser wishlist for easy access anytime.
          </p>
        </div>
      </div>

      {selectedOrderProduct && (
        <OrderModal product={selectedOrderProduct} onClose={() => setSelectedOrderProduct(null)} />
      )}
    </>
  );
}

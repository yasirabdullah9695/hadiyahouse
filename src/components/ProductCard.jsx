import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import OrderModal from "@/components/OrderModal";

const PREMIUM_EASE = [0.22, 1, 0.36, 1];
const DEFAULT_FALLBACK = "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png";

export default function ProductCard({ product, index = 0 }) {
  const [liked, setLiked] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  const badgeStyles = {
    "Best Seller": "bg-[#1A1F2C] text-[#D4C3A5] border border-[#D4C3A5]/40",
    "New Arrival": "bg-[#4A5D4E] text-[#F9F7F2]",
    "Customisable": "bg-[#1A1F2C] text-[#D4C3A5]",
  };

  const imageSrc = product.image || DEFAULT_FALLBACK;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.35), ease: PREMIUM_EASE }}
        className="group relative bg-white rounded-xl overflow-hidden border border-[#D4C3A5]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#1A1F2C]/8 hover:-translate-y-1 flex flex-col justify-between"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.badge && (
            <span className={`text-[8.5px] tracking-[0.18em] font-bold px-2.5 py-1 rounded-full uppercase shadow-sm ${badgeStyles[product.badge] || "bg-[#1A1F2C] text-[#D4C3A5]"}`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart size={14} strokeWidth={1.8} className={liked ? "fill-[#C5564A] text-[#C5564A]" : "text-[#1A1F2C]"} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.id || product._id}`} className="block aspect-[4/5] overflow-hidden bg-[#F0EDE5] relative">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_FALLBACK;
            }}
          />
          
          {/* Quick Order Hover Button Overlay */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowOrder(true);
              }}
              className="w-full bg-[#1A1F2C]/95 text-[#D4C3A5] backdrop-blur-md text-[10px] tracking-[0.15em] font-bold py-2.5 rounded-full hover:bg-[#1A1F2C] shadow-lg transition-all flex items-center justify-center gap-1.5 border border-[#D4C3A5]/30"
            >
              <ShoppingBag size={12} /> QUICK ORDER
            </button>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col justify-between bg-white">
          <div>
            {product.category && (
              <p className="text-[9px] tracking-[0.2em] font-bold text-[#4A5D4E] uppercase mb-1 truncate">
                {product.category}
              </p>
            )}
            <Link to={`/product/${product.id || product._id}`}>
              <h3 className="font-display text-[14px] sm:text-[15px] font-medium tracking-wide text-[#1A1F2C] leading-snug hover:text-[#4A5D4E] transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#D4C3A5]/15">
            <span className="font-heading text-[15px] font-bold text-[#1A1F2C]">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            <button
              onClick={() => setShowOrder(true)}
              className="flex items-center gap-1 text-[9.5px] tracking-[0.15em] font-bold text-[#1A1F2C] hover:text-[#4A5D4E] transition-colors"
            >
              ORDER NOW <ArrowRight size={11} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>

      {showOrder && (
        <OrderModal product={product} onClose={() => setShowOrder(false)} />
      )}
    </>
  );
}
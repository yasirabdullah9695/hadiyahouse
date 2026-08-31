import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const PREMIUM_EASE = [0.22, 1, 0.36, 1];

export default function ProductCard({ product, index = 0 }) {
  const [liked, setLiked] = useState(false);

  const badgeStyles = {
    "Best Seller": "bg-[#1A1F2C] text-[#D4C3A5]",
    "New Arrival": "bg-[#4A5D4E] text-[#F9F7F2]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.42), ease: PREMIUM_EASE }}
      className="group relative bg-[#FBF9F4] rounded-lg overflow-hidden border border-[#D4C3A5]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#1A1F2C]/5 hover:-translate-y-1"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className={`text-[9px] tracking-[0.15em] font-semibold px-2.5 py-1 rounded-full ${badgeStyles[product.badge] || "bg-[#1A1F2C] text-[#D4C3A5]"}`}>
            {product.badge.toUpperCase()}
          </span>
        )}
      </div>

      {/* Heart */}
      <button
        onClick={() => setLiked(!liked)}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#F9F7F2]/80 backdrop-blur flex items-center justify-center hover:bg-[#F9F7F2] transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart size={15} strokeWidth={1.5} className={liked ? "fill-[#C5564A] text-[#C5564A]" : "text-[#1A1F2C]"} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden bg-[#F0EDE5]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            fittingType="fill"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#1A1F2C]/30 text-[11px] tracking-widest">HADIYA HOUSE</div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-[15px] tracking-wide text-[#1A1F2C] leading-snug">{product.name}</h3>
        </Link>
        {product.description && (
          <p className="text-[11px] text-[#1A1F2C]/50 mt-1">{product.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="font-heading text-[15px] font-semibold text-[#1A1F2C]">₹{product.price.toLocaleString("en-IN")}</span>
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1 text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] hover:text-[#4A5D4E] transition-colors"
          >
            VIEW DETAILS <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
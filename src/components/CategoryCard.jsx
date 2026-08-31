import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const PREMIUM_EASE = [0.22, 1, 0.36, 1];

export default function CategoryCard({ category, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.42), ease: PREMIUM_EASE }}
      className="group relative rounded-xl overflow-hidden border border-[#D4C3A5]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#1A1F2C]/10 hover:-translate-y-1"
    >
      <Link to={`/shop?category=${category.key}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EDE5]">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.label}
              className="w-full h-full transition-transform duration-700 group-hover:scale-105"
              fittingType="fill"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#1A1F2C]/30 text-[11px] tracking-widest">HADIYA HOUSE</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C]/85 via-[#1A1F2C]/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
            <h3 className="font-display text-xl lg:text-2xl text-[#F9F7F2] tracking-wide">{category.label}</h3>
            <p className="text-[11px] lg:text-[12px] text-[#F9F7F2]/70 mt-1">{category.subtitle}</p>
            <span className="inline-flex items-center gap-1.5 mt-3 text-[10px] tracking-[0.2em] font-semibold text-[#D4C3A5]">
              SHOP NOW <ArrowRight size={12} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
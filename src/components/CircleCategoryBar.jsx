import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCircleCategories } from "@/components/admin/AdminCircleCategories";

export default function CircleCategoryBar() {
  const [categories, setCategories] = useState(() => getCircleCategories());

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(getCircleCategories());
    };
    window.addEventListener("circle-categories-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("circle-categories-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <section className="bg-[#F0EDE5] py-3.5 border-b border-[#D4C3A5]/30 shadow-inner overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-start sm:justify-center gap-4 sm:gap-7 overflow-x-auto no-scrollbar py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat, index) => (
            <Link
              key={cat.id || cat.name || index}
              to={cat.to || `/shop?category=${encodeURIComponent(cat.label)}`}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer text-center"
            >
              {/* Circle Image Thumbnail */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white p-0.5 border-2 border-[#D4C3A5] shadow-md group-hover:border-[#1A1F2C] group-hover:scale-105 transition-all duration-300">
                <img
                  src={cat.image || "/signature_box_packaging.jpg"}
                  alt={cat.label}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/signature_box_packaging.jpg";
                  }}
                />
              </div>
              {/* Label */}
              <span className="text-[10px] sm:text-[11px] font-bold text-[#1A1F2C] tracking-tight group-hover:text-[#4A5D4E] transition-colors whitespace-nowrap">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

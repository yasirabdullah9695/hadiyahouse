import React from "react";
import { Link } from "react-router-dom";

const CIRCLE_CATEGORIES = [
  {
    name: "Gift Boxes",
    label: "Gift Boxes",
    to: "/shop?category=Gift+Boxes",
    image: "/signature_box_packaging.jpg",
  },
  {
    name: "Calligraphy",
    label: "Calligraphy",
    to: "/shop?category=Custom+Calligraphy+Frame",
    image: "/calligraphy_frame_sample.jpg",
  },
  {
    name: "Attars",
    label: "Attars & Perfumes",
    to: "/shop?category=Perfume+%26+Attar",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png",
  },
  {
    name: "Prayer Mats",
    label: "Prayer Mats",
    to: "/shop?category=Prayer+Mat",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/8b5930422_generated_2d3be97f.png",
  },
  {
    name: "Tasbeeh",
    label: "Tasbeeh & Beads",
    to: "/shop?category=Tasbeeh",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/c178ea7ae_generated_image.png",
  },
  {
    name: "Nikah",
    label: "Nikah Hampers",
    to: "/shop?category=Nikah",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/6a8a98432ec51b3deb4874f3/f976def70_generated_6a9962be.png",
  },
  {
    name: "Hajj & Umrah",
    label: "Hajj & Umrah",
    to: "/shop?category=Hajj",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/e94d9482f_generated_image.png",
  },
  {
    name: "Hijab & Caps",
    label: "Hijab & Caps",
    to: "/shop?category=Hijab+Kit",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/032ee1fa3_generated_image.png",
  },
];

export default function CircleCategoryBar() {
  return (
    <section className="bg-[#F0EDE5] py-4 border-b border-[#D4C3A5]/30 shadow-inner overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-between sm:justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CIRCLE_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.to}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer text-center"
            >
              {/* Circle Image Thumbnail */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white p-0.5 border-2 border-[#D4C3A5] shadow-md group-hover:border-[#1A1F2C] group-hover:scale-105 transition-all duration-300">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
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

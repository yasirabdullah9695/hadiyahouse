import React from "react";
import { Gem, Gift, MessageCircle } from "lucide-react";

const FEATURES = [
  { icon: Gem, title: "100% AUTHENTIC QUALITY", subtitle: "Curated with devotion" },
  { icon: Gift, title: "FREE SIGNATURE PACKAGING", subtitle: "Gold-foil luxury box & bag" },
  { icon: MessageCircle, title: "WHATSAPP CUSTOMISATION", subtitle: "Direct personal support" },
];

export default function FeatureBar() {
  return (
    <section className="bg-[#121620] py-10 lg:py-12 border-t border-[#D4C3A5]/20 text-[#F9F7F2]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 grid grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#1A1F2C]/60 border border-[#D4C3A5]/20 hover:border-[#D4C3A5]/50 transition-all duration-300 group shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-[#D4C3A5]/10 border border-[#D4C3A5]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <f.icon size={22} strokeWidth={1.5} className="text-[#D4C3A5]" />
            </div>
            <p className="text-[10.5px] tracking-[0.18em] font-bold text-[#F9F7F2] uppercase">{f.title}</p>
            <p className="text-[11px] text-[#D4C3A5]/70 mt-1">{f.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
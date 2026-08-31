import React from "react";
import { Gem, Gift, HeartHandshake, Truck } from "lucide-react";

const FEATURES = [
  { icon: Gem, title: "PREMIUM QUALITY", subtitle: "Curated with care" },
  { icon: Gift, title: "ELEGANT PACKAGING", subtitle: "Gift-ready always" },
  { icon: HeartHandshake, title: "MADE WITH CARE", subtitle: "Handcrafted hampers" },
  { icon: Truck, title: "FAST & SAFE DELIVERY", subtitle: "Pan-India shipping" },
];

export default function FeatureBar() {
  return (
    <section className="bg-[#1A1F2C] py-12">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center gap-3">
            <f.icon size={28} strokeWidth={1.2} className="text-[#D4C3A5]" />
            <div>
              <p className="text-[11px] tracking-[0.2em] font-semibold text-[#F9F7F2]">{f.title}</p>
              <p className="text-[10px] tracking-[0.1em] text-[#D4C3A5]/70 mt-1">{f.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
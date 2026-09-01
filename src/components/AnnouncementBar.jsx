import React, { useState, useEffect } from "react";
import { Sparkles, Truck, Phone, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const ANNOUNCEMENTS = [
  { icon: Gift, text: "✨ FREE SIGNATURE LUXURY BOX & GIFT BAG ON ALL ORDERS" },
  { icon: Truck, text: "🚚 PAN-INDIA EXPRESS SHIPPING & FAST DISPATCH" },
  { icon: Sparkles, text: "🎨 CUSTOM ARABIC CALLIGRAPHY NAME FRAMING AVAILABLE" },
  { icon: Phone, text: `💬 DIRECT WHATSAPP ORDERS & SUPPORT: +91 96693 97762` },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = ANNOUNCEMENTS[index].icon;

  return (
    <div className="bg-[#121620] text-[#D4C3A5] border-b border-[#D4C3A5]/20 py-2 px-4 text-center relative z-50 text-[10.5px] sm:text-[11px] tracking-[0.15em] font-semibold uppercase flex items-center justify-between">
      <button
        onClick={() => setIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
        className="text-[#D4C3A5]/60 hover:text-[#D4C3A5] transition-colors px-2"
        aria-label="Previous announcement"
      >
        <ChevronLeft size={13} />
      </button>

      <div className="flex items-center justify-center gap-2 mx-auto truncate max-w-2xl">
        <CurrentIcon size={13} className="text-[#D4C3A5] flex-shrink-0" />
        <span className="truncate">{ANNOUNCEMENTS[index].text}</span>
      </div>

      <button
        onClick={() => setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
        className="text-[#D4C3A5]/60 hover:text-[#D4C3A5] transition-colors px-2"
        aria-label="Next announcement"
      >
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

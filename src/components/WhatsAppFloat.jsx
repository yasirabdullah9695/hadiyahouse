import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(true);

  const customQueryMessage = encodeURIComponent(
    "Hello Dar-Ul-Hadaya! I have a query regarding Custom Gift Box / Calligraphy Name Framing."
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${customQueryMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-[#1A1F2C] text-[#F9F7F2] text-[11px] font-medium px-3.5 py-2 rounded-xl border border-[#D4C3A5]/30 shadow-2xl flex items-center gap-2 max-w-[220px] animate-bounce">
          <span className="text-[#D4C3A5] font-bold">✨ Need Custom Framing?</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#F9F7F2]/50 hover:text-white ml-auto"
            title="Close"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 hover:bg-[#20ba5a] transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        {/* Outer Glow Pulse */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 pointer-events-none" />

        <MessageCircle size={28} className="relative z-10 fill-current" />

        {/* Hover Badge */}
        <span className="absolute right-16 bg-[#1A1F2C] text-[#D4C3A5] border border-[#D4C3A5]/30 text-[10px] tracking-[0.1em] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}

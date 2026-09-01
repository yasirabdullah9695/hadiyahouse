import React, { useState } from "react";
import { Instagram, Facebook, Mail, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer id="contact" className="bg-[#1A1F2C] text-[#F9F7F2] border-t border-[#D4C3A5]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-start">
          
          {/* Col 1: Brand & Socials */}
          <div className="col-span-2 md:col-span-1 space-y-2">
            <div className="flex flex-col leading-none">
              <span className="font-display text-base tracking-[0.15em] text-[#D4C3A5] font-semibold">Hadiya House</span>
              <span className="text-[7.5px] tracking-[0.25em] text-[#F9F7F2]/50 mt-0.5 uppercase">GIFTS FOR THE JOURNEY</span>
            </div>
            <p className="text-[11px] leading-tight text-[#F9F7F2]/60">
              Thoughtfully curated Islamic gift boxes for every blessed occasion.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="text-[#F9F7F2]/70 hover:text-[#D4C3A5] transition-colors" aria-label="Instagram"><Instagram size={14} /></a>
              <a href="#" className="text-[#F9F7F2]/70 hover:text-[#D4C3A5] transition-colors" aria-label="Facebook"><Facebook size={14} /></a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-[#F9F7F2]/70 hover:text-[#D4C3A5] transition-colors" aria-label="WhatsApp"><MessageCircle size={14} /></a>
              <a href="mailto:hello@hadiyahouse.in" className="text-[#F9F7F2]/70 hover:text-[#D4C3A5] transition-colors" aria-label="Email"><Mail size={14} /></a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-[9px] tracking-[0.2em] font-bold text-[#D4C3A5] uppercase mb-1.5">QUICK LINKS</h4>
            <ul className="space-y-1 text-[11px] text-[#F9F7F2]/60 font-medium">
              <li><a href="/" className="hover:text-[#D4C3A5] transition-colors">Home</a></li>
              <li><a href="/shop" className="hover:text-[#D4C3A5] transition-colors">Shop Collection</a></li>
              <li><a href="/#categories" className="hover:text-[#D4C3A5] transition-colors">Occasion Boxes</a></li>
              <li><a href="/#about" className="hover:text-[#D4C3A5] transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Col 3: Help & Support */}
          <div>
            <h4 className="text-[9px] tracking-[0.2em] font-bold text-[#D4C3A5] uppercase mb-1.5">HELP & SUPPORT</h4>
            <ul className="space-y-1 text-[11px] text-[#F9F7F2]/60 font-medium">
              <li><a href="#" className="hover:text-[#D4C3A5] transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-[#D4C3A5] transition-colors">FAQs</a></li>
              <li><a href="/admin" className="hover:text-[#D4C3A5] transition-colors font-semibold text-[#D4C3A5]/80">Admin Portal</a></li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Contact */}
          <div className="col-span-2 md:col-span-1 space-y-2">
            <h4 className="text-[9px] tracking-[0.2em] font-bold text-[#D4C3A5] uppercase mb-1">STAY CONNECTED</h4>
            {subscribed ? (
              <p className="text-[11px] text-[#D4C3A5]">Subscribed ✦</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-[#121620] border border-[#D4C3A5]/30 rounded-full px-3 py-1 text-[11px] text-[#F9F7F2] placeholder:text-[#F9F7F2]/40 focus:outline-none focus:border-[#D4C3A5] w-full"
                />
                <button type="submit" className="bg-[#D4C3A5] text-[#1A1F2C] text-[9px] tracking-[0.1em] font-bold px-3 py-1.5 rounded-full hover:bg-[#C5B395] transition-colors flex-shrink-0">
                  JOIN
                </button>
              </form>
            )}
            <div className="text-[11px] text-[#F9F7F2]/60 space-y-0.5 pt-0.5">
              <p className="flex items-center gap-1.5"><Phone size={11} className="text-[#D4C3A5]" /> +91 96693 97762</p>
              <p className="flex items-center gap-1.5"><Mail size={11} className="text-[#D4C3A5]" /> hello@hadiyahouse.in</p>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#F9F7F2]/10 bg-[#121620] py-2 text-center">
        <p className="text-[9.5px] tracking-[0.1em] text-[#F9F7F2]/40">
          <span
            onDoubleClick={() => (window.location.href = "/admin")}
            className="cursor-default select-none"
            title="Hadiya House"
          >
            ©
          </span>{" "}
          {new Date().getFullYear()} Hadiya House — Gifts for the Journey. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
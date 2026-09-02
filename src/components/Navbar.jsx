import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { LOGO_ICON_URL } from "@/lib/constants";
import AnnouncementBar from "@/components/AnnouncementBar";

const NAV_LINKS = [
  { label: "HOME", to: "/" },
  { label: "SHOP", to: "/shop" },
  { label: "GIFT BOXES", to: "/shop?category=Gift+Boxes" },
  { label: "CALLIGRAPHY", to: "/shop?category=Custom+Calligraphy+Frame" },
  { label: "ABOUT US", to: "/#about" },
  { label: "CONTACT", to: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 bg-[#1A1F2C] border-b border-[#D4C3A5]/20 shadow-md">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo (Positioned in Left Corner, Clear & Zoomed) */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-[#F9F7F2] flex-shrink-0 border-2 border-[#D4C3A5] shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img
                  src={LOGO_ICON_URL}
                  alt="Dar-Ul-Hadaya"
                  className="w-full h-full object-cover scale-125 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl tracking-[0.15em] leading-tight text-[#F9F7F2] font-semibold group-hover:text-[#D4C3A5] transition-colors">
                  Dar-Ul-Hadaya
                </span>
                <span className="text-[8px] tracking-[0.25em] text-[#D4C3A5]/80 leading-none mt-0.5 font-medium uppercase">
                  The Home of Meaningful Luxe
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-[12px] tracking-[0.2em] font-semibold text-[#F9F7F2]/90 hover:text-[#D4C3A5] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/shop"
                className="bg-[#D4C3A5] text-[#1A1F2C] text-[11px] tracking-[0.2em] font-bold px-5 py-2.5 rounded-full hover:bg-[#C5B395] transition-all shadow-md hover:scale-105"
              >
                ORDER NOW
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-[#F9F7F2] p-2 hover:text-[#D4C3A5]"
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="lg:hidden bg-[#1A1F2C] border-b border-[#D4C3A5]/20 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-[12px] tracking-[0.2em] font-semibold text-[#F9F7F2]/90 hover:text-[#D4C3A5]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="inline-flex justify-center bg-[#D4C3A5] text-[#1A1F2C] text-[11px] tracking-[0.2em] font-bold px-5 py-3 rounded-full shadow-md"
              >
                ORDER NOW
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, Menu, X } from "lucide-react";
import { LOGO_ICON_URL } from "@/lib/constants";
import AnnouncementBar from "@/components/AnnouncementBar";
import SearchModal from "@/components/SearchModal";
import WishlistDrawer, { getWishlist } from "@/components/WishlistDrawer";

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
  const [showSearch, setShowSearch] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(() => getWishlist().length);

  useEffect(() => {
    const handleWishlistChange = () => setWishlistCount(getWishlist().length);
    window.addEventListener("wishlist-updated", handleWishlistChange);
    window.addEventListener("storage", handleWishlistChange);
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistChange);
      window.removeEventListener("storage", handleWishlistChange);
    };
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 bg-[#1A1F2C] border-b border-[#D4C3A5]/20 shadow-md">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="h-11 sm:h-13 flex-shrink-0 flex items-center">
                <img
                  src={LOGO_ICON_URL}
                  alt="Auren"
                  className="h-full w-auto max-w-[140px] sm:max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl tracking-[0.2em] leading-tight text-[#F9F7F2] font-semibold group-hover:text-[#D4C3A5] transition-colors">
                  Auren
                </span>
                <span className="text-[8px] tracking-[0.25em] text-[#D4C3A5]/80 leading-none mt-0.5 font-medium uppercase">
                  Gifts with Meaning
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-[12px] tracking-[0.2em] font-semibold text-[#F9F7F2]/90 hover:text-[#D4C3A5] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Action Buttons: Search, Wishlist, Order Now */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Icon */}
              <button
                onClick={() => setShowSearch(true)}
                className="text-[#F9F7F2]/80 hover:text-[#D4C3A5] p-2 transition-colors flex items-center gap-1.5 text-[11px] font-semibold tracking-wider"
                aria-label="Search Store"
                title="Search Products"
              >
                <Search size={18} strokeWidth={1.8} />
                <span className="hidden sm:inline text-[11px] tracking-[0.15em]">SEARCH</span>
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={() => setShowWishlist(true)}
                className="relative text-[#F9F7F2]/80 hover:text-[#D4C3A5] p-2 transition-colors"
                aria-label="Wishlist"
                title="Saved Wishlist"
              >
                <Heart size={19} strokeWidth={1.8} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#C5564A] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#1A1F2C]">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Order Now Button */}
              <Link
                to="/shop"
                className="hidden sm:inline-flex bg-[#D4C3A5] text-[#1A1F2C] text-[11px] tracking-[0.2em] font-bold px-5 py-2.5 rounded-full hover:bg-[#C5B395] transition-all shadow-md hover:scale-105"
              >
                ORDER NOW
              </Link>

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

      {/* Modals */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <WishlistDrawer isOpen={showWishlist} onClose={() => setShowWishlist(false)} />
    </>
  );
}
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowDownRight, Sparkles } from "lucide-react";

const HERO_SLIDES = [
  {
    id: "slide-1",
    image: "/hero_showcase_1.jpg",
    title: "LUXURY ISLAMIC HAMPER",
    subtitle: "Velvet Mat · Quran Kareem · Crystal Attar · Golden Tasbeeh",
  },
  {
    id: "slide-2",
    image: "/signature_box_packaging.jpg",
    title: "✨ BUILD YOUR OWN DAR-UL-HADAYA BOX",
    subtitle: "Select specific Attars, Tasbeeh, Mat & Frame · Live Price Calculator",
    isCustomBox: true,
    link: "#custom-box",
  },
  {
    id: "slide-3",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/f976def70_generated_6a9962be.png",
    title: "NIKAH MUBARAK GIFT COLLECTION",
    subtitle: "Thoughtfully Curated Hampers for Bride & Groom",
  },
  {
    id: "slide-4",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/e94d9482f_generated_image.png",
    title: "HAJJ & UMRAH BLESSINGS SET",
    subtitle: "Spiritual Essentials for Sacred Journeys",
  },
  {
    id: "slide-5",
    image: "/calligraphy_frame_sample.jpg",
    title: "CUSTOM ARABIC CALLIGRAPHY",
    subtitle: "Hand-framed Personalised Name Art",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const currentSlide = HERO_SLIDES[index];

  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#181E2C] border border-[#D4C3A5]/30 shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121620]/90 via-black/20 to-black/10" />

          {/* Slide Caption Badge */}
          <div className="absolute bottom-4 left-4 right-4 text-left p-3.5 sm:p-4 rounded-xl bg-[#121620]/85 backdrop-blur-md border border-[#D4C3A5]/40 flex items-center justify-between gap-3 shadow-xl">
            <div className="min-w-0 flex-1">
              <span className="text-[9.5px] sm:text-[10.5px] tracking-[0.18em] font-bold text-[#D4C3A5] uppercase block truncate flex items-center gap-1.5">
                {currentSlide.isCustomBox && <Sparkles size={13} className="text-[#D4C3A5] animate-pulse flex-shrink-0" />}
                {currentSlide.title}
              </span>
              <span className="text-[11px] sm:text-[12px] text-[#F9F7F2]/80 mt-0.5 block font-medium truncate">
                {currentSlide.subtitle}
              </span>
            </div>

            {/* Direct Action Link for Custom Box slide */}
            {currentSlide.isCustomBox && (
              <a
                href="#custom-box"
                className="bg-[#D4C3A5] text-[#121620] text-[9.5px] sm:text-[10.5px] tracking-[0.15em] font-bold px-3.5 py-2 rounded-full hover:bg-[#e2d3b7] transition-all flex items-center gap-1 flex-shrink-0 shadow-lg"
              >
                BUILD NOW <ArrowDownRight size={13} strokeWidth={2.5} />
              </a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#121620]/70 text-[#D4C3A5] border border-[#D4C3A5]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#121620]"
        aria-label="Previous slide"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#121620]/70 text-[#D4C3A5] border border-[#D4C3A5]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#121620]"
        aria-label="Next slide"
      >
        <ChevronRight size={16} />
      </button>

    </div>
  );
}

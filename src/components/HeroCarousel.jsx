import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "/hero_showcase_1.jpg",
    title: "LUXURY ISLAMIC HAMPER",
    subtitle: "Velvet Mat · Quran Kareem · Crystal Attar",
  },
  {
    image: "/signature_box_packaging.jpg",
    title: "DAR-UL-HADAYA SIGNATURE PACKAGING",
    subtitle: "Gold-Foil Presentation Box & Gift Bag",
  },
  {
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/f976def70_generated_6a9962be.png",
    title: "NIKAH MUBARAK GIFT COLLECTION",
    subtitle: "Thoughtfully Curated for Bride & Groom",
  },
  {
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/e94d9482f_generated_image.png",
    title: "HAJJ & UMRAH BLESSINGS SET",
    subtitle: "Spiritual Essentials for Sacred Journeys",
  },
  {
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
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

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
            src={HERO_SLIDES[index].image}
            alt={HERO_SLIDES[index].title}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121620]/90 via-transparent to-black/10" />

          {/* Slide Caption Badge */}
          <div className="absolute bottom-4 left-4 right-4 text-left p-3.5 rounded-xl bg-[#121620]/80 backdrop-blur-md border border-[#D4C3A5]/30">
            <span className="text-[9px] tracking-[0.2em] font-bold text-[#D4C3A5] uppercase block">
              {HERO_SLIDES[index].title}
            </span>
            <span className="text-[11px] text-[#F9F7F2]/80 mt-0.5 block font-medium">
              {HERO_SLIDES[index].subtitle}
            </span>
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

      {/* Dot Indicators */}
      <div className="absolute bottom-2.5 right-4 z-20 flex items-center gap-1.5">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === i ? "w-5 bg-[#D4C3A5]" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

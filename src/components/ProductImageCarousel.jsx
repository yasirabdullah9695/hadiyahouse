import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductImageCarousel({
  images = [],
  name = "Product",
  badge = null,
}) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: validImages.length > 1,
    dragFree: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, validImages, onSelect]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (validImages.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F0EDE5] border border-[#D4C3A5]/30 shadow-lg relative flex items-center justify-center text-[#1A1F2C]/30 text-[11px] tracking-widest uppercase">
        AUREN
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image carousel viewport */}
      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F0EDE5] border border-[#D4C3A5]/30 shadow-lg relative group">
        <div className="w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {validImages.map((src, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 h-full relative">
                <img
                  src={src}
                  alt={`${name} - Angle ${i + 1}`}
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 z-10 text-[9px] tracking-[0.18em] font-bold px-3 py-1.5 rounded-full bg-[#1A1F2C] text-[#D4C3A5] uppercase shadow-md border border-[#D4C3A5]/40">
            {badge}
          </span>
        )}

        {/* Counter Badge */}
        {validImages.length > 1 && (
          <span className="absolute bottom-4 right-4 z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white shadow">
            {selectedIndex + 1} / {validImages.length}
          </span>
        )}

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 text-[#1A1F2C] shadow-md flex items-center justify-center hover:bg-white transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 text-[#1A1F2C] shadow-md flex items-center justify-center hover:bg-white transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Multiple Angle Thumbnails Preview Strip */}
      {validImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {validImages.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              className={`relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === i
                  ? "border-[#1A1F2C] shadow-md ring-2 ring-[#1A1F2C]/20 scale-105"
                  : "border-[#D4C3A5]/40 opacity-70 hover:opacity-100 hover:border-[#1A1F2C]/60"
              }`}
            >
              <img
                src={src}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

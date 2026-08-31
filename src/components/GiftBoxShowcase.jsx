import React from "react";
import { Image } from "@/components/ui/image";

const BOXES = [
  {
    num: "1",
    title: "NIKAH GIFT BOX",
    subtitle: "For Bride & Groom",
    contents: ["Personalized Box", "Quran", "Prayer Mat", "Tasbeeh", "Attar", "Chocolates / Dates"],
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/f976def70_generated_6a9962be.png",
    bg: "#F4EFE6",
    text: "#1A1F2C",
    calligraphy: "And We created you in pairs — 78:8",
  },
  {
    num: "2",
    title: "HAJJ GIFT BOX",
    subtitle: "For Pilgrims",
    contents: ["Hajj Guide Book", "Prayer Mat", "Tasbeeh", "Dates", "Dua Card"],
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/e94d9482f_generated_image.png",
    bg: "#1E1E1E",
    text: "#F9F7F2",
    calligraphy: "Labbaik Allahumma Labbaik — May Allah accept your Hajj",
  },
  {
    num: "3",
    title: "UMRAH GIFT BOX",
    subtitle: "For A Blessed Journey",
    contents: ["Umrah Guide Book", "Prayer Mat", "Tasbeeh", "Attar", "Pouch", "Dua Card"],
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/1c10b3a36_generated_4fcff911.png",
    bg: "#1B3626",
    text: "#F9F7F2",
    calligraphy: "May Allah accept your Umrah",
  },
  {
    num: "4",
    title: "TRAVELLER KIT BOX",
    subtitle: "Compact & Essential",
    contents: ["Compact Prayer Mat", "Travel Tasbeeh", "Attar (Roll On)", "Qibla Compass", "Travel Pouch", "Dua Card"],
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/8b5930422_generated_2d3be97f.png",
    bg: "#1E1E1E",
    text: "#F9F7F2",
    calligraphy: "Faith wherever you go",
  },
];

export default function GiftBoxShowcase() {
  return (
    <section className="bg-[#1A1A1A] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl lg:text-4xl tracking-[0.15em] text-[#C5A059]">ISLAMIC GIFT BOX — SAMPLE DESIGNS</h2>
          <p className="text-[12px] lg:text-[13px] tracking-[0.1em] text-[#F9F7F2]/50 mt-3">
            Premium Packaging Ideas For Nikah, Hajj, Umrah & Traveller Gifts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {BOXES.map((box) => (
            <div
              key={box.num}
              className="rounded-xl overflow-hidden flex flex-col md:flex-row"
              style={{ backgroundColor: box.bg, color: box.text }}
            >
              {/* Visual */}
              <div className="md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden">
                <Image
                  src={box.image}
                  alt={box.title}
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-6 lg:p-8 flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-2xl" style={{ color: "#C5A059" }}>{box.num}.</span>
                  <h3 className="font-display text-lg lg:text-xl tracking-wide">{box.title}</h3>
                </div>
                <p className="text-[11px] tracking-[0.15em] opacity-60 mb-5">{box.subtitle.toUpperCase()}</p>

                <p className="text-[10px] tracking-[0.2em] font-semibold mb-3 opacity-70">WHAT'S INSIDE</p>
                <ul className="space-y-2">
                  {box.contents.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[13px]">
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "#C5A059" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom branding bar */}
        <div className="mt-12 pt-8 border-t border-[#C5A059]/20 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            "PREMIUM QUALITY",
            "ELEGANT PACKAGING",
            "PERFECT FOR EVERY OCCASION",
            "MEANINGFUL & PRACTICAL",
          ].map((label) => (
            <p key={label} className="text-[10px] tracking-[0.2em] font-semibold text-[#C5A059]">✦ {label}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
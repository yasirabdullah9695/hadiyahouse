import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureBar from "@/components/FeatureBar";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import GiftBoxShowcase from "@/components/GiftBoxShowcase";
import ChooseYourHadiya from "@/components/ChooseYourHadiya";
import { Image } from "@/components/ui/image";
import { productsApi } from "@/api/apiClient";
import { CATEGORIES } from "@/lib/constants";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/MotionWrapper";

import CircleCategoryBar from "@/components/CircleCategoryBar";

const HERO_IMG = "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png";
const CAT_IMAGES = {
  Nikah: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/f976def70_generated_6a9962be.png",
  Hajj: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/e94d9482f_generated_image.png",
  Umrah: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/1c10b3a36_generated_4fcff911.png",
  Traveller: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/8b5930422_generated_2d3be97f.png",
  "Hijab Kit": "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/032ee1fa3_generated_image.png",
  "Hifz Completion": "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/c178ea7ae_generated_image.png",
  "Father's Gift Kit": "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/62da106ac_generated_image.png",
  "Mother's Gift Kit": "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/0d7e92352_generated_image.png",
  "Custom Calligraphy Frame": "/calligraphy_frame_sample.jpg",
};

const SAMPLE_GIFT_BOXES = [
  {
    id: "sample-nikah-1",
    name: "Luxury Nikah Hamper",
    price: 1999,
    category: "Nikah",
    type: "Gift Box",
    badge: "Best Seller",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/f976def70_generated_6a9962be.png",
  },
  {
    id: "sample-hajj-1",
    name: "Blessed Hajj Gift Set",
    price: 2499,
    category: "Hajj",
    type: "Gift Box",
    badge: "New Arrival",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/e94d9482f_generated_image.png",
  },
  {
    id: "sample-umrah-1",
    name: "Umrah Mubarak Hamper",
    price: 1799,
    category: "Umrah",
    type: "Gift Box",
    badge: "Popular",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/1c10b3a36_generated_4fcff911.png",
  },
  {
    id: "sample-calligraphy-1",
    name: "Custom Calligraphy Name Frame Box",
    price: 1299,
    category: "Custom Calligraphy Frame",
    type: "Gift Box",
    badge: "Customisable",
    image: "/calligraphy_frame_sample.jpg",
  },
  {
    id: "sample-hijab-1",
    name: "Modesty Hijab Gift Box",
    price: 1199,
    category: "Hijab Kit",
    type: "Gift Box",
    badge: "Gift Choice",
    image: "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/032ee1fa3_generated_image.png",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.list("-createdAt", 200)
      .then((data) => {
        const visible = (data || []).filter((p) => !p.hidden);
        setProducts(visible);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const giftBoxes = products.filter((p) => (p.type || "Gift Box") === "Gift Box");
  const individualItems = products.filter((p) => p.type === "Individual Item");

  const groupByCategory = (list) => {
    const groups = {};
    list.forEach((p) => {
      const cat = p.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return Object.entries(groups);
  };

  // Gift boxes: show sample cards until admin adds real ones
  const giftBoxList = giftBoxes.length > 0 ? giftBoxes : SAMPLE_GIFT_BOXES;
  // Individual items: ONLY real items from admin — no fallback samples
  const giftBoxGroups = groupByCategory(giftBoxList);
  const individualItemGroups = groupByCategory(individualItems);

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />
      <CircleCategoryBar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F9F7F2]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center"
        >
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] font-semibold text-[#4A5D4E] mb-5">
              <Sparkles size={14} strokeWidth={1.5} /> PREMIUM ISLAMIC GIFT BOXES
            </div>
            <h1 className="font-display text-4xl lg:text-6xl leading-[1.1] text-[#1A1F2C] tracking-tight">
              Thoughtful Gifts.<br />For Every Blessed Journey.
            </h1>
            <p className="text-[15px] lg:text-base text-[#1A1F2C]/60 mt-6 max-w-md leading-relaxed">
              Premium Islamic gift boxes for Nikah, Hajj, Umrah and every special moment — curated with care, packaged with elegance.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.2em] font-semibold px-8 py-4 rounded-full hover:bg-[#2a3142] transition-colors"
              >
                EXPLORE COLLECTION <ArrowRight size={14} strokeWidth={2} />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center text-[11px] tracking-[0.2em] font-semibold text-[#1A1F2C] px-6 py-4 border border-[#1A1F2C]/30 rounded-full hover:border-[#1A1F2C] transition-colors"
              >
                VIEW CATEGORIES
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F0EDE5]">
              <Image src={HERO_IMG} alt="Hadiya House premium gift box" className="w-full h-full" fittingType="fill" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Choose Your Hadiya signature box */}
      <ChooseYourHadiya />

      {/* Category cards */}
      <section id="categories" className="py-16 lg:py-24 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <FadeIn className="text-center mb-12">
            <p className="text-[10px] tracking-[0.3em] font-semibold text-[#4A5D4E] mb-3">OUR COLLECTIONS</p>
            <h2 className="font-display text-3xl lg:text-4xl text-[#1A1F2C] tracking-tight">Gifts for Every Sacred Occasion</h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.key} category={{ ...cat, image: CAT_IMAGES[cat.key] }} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Gift box showcase */}
      <GiftBoxShowcase />

      {/* Individual Items by category */}
      <section className="py-16 lg:py-24 bg-[#F0EDE5]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <FadeIn className="text-center mb-10">
            <p className="text-[10px] tracking-[0.3em] font-semibold text-[#4A5D4E] mb-3">INDIVIDUAL ITEMS</p>
            <h2 className="font-display text-3xl lg:text-4xl text-[#1A1F2C] tracking-tight">Shop Individual Pieces</h2>
          </FadeIn>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-lg bg-[#F9F7F2] animate-pulse" />
              ))}
            </div>
          ) : individualItemGroups.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-[#D4C3A5]/40 rounded-2xl">
              <p className="font-display text-2xl text-[#1A1F2C]/40 mb-2">Coming Soon</p>
              <p className="text-[13px] text-[#1A1F2C]/40">Individual items will appear here once added by admin.</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 mt-6 text-[11px] tracking-[0.2em] font-semibold text-[#4A5D4E] border-b border-[#4A5D4E] pb-1"
              >
                BROWSE ALL PRODUCTS <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </div>
          ) : (
            <>
              {individualItemGroups.map(([category, items]) => (
                <div key={category} className="mb-10 last:mb-0">
                  <h3 className="font-display text-xl text-[#1A1F2C] mb-5 pb-2 border-b border-[#D4C3A5]/30">{category}</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
                    {items.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-center mt-10">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] font-semibold text-[#1A1F2C] border-b border-[#1A1F2C] pb-1 hover:text-[#4A5D4E] hover:border-[#4A5D4E] transition-colors"
                >
                  VIEW ALL PRODUCTS <ArrowRight size={14} strokeWidth={2} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About strip */}
      <section id="about" className="py-8 lg:py-10 bg-[#1A1F2C] text-[#F9F7F2]">
        <FadeIn className="max-w-3xl mx-auto px-5 lg:px-10 text-center">
          <p className="text-[9px] tracking-[0.25em] font-semibold text-[#D4C3A5] mb-1.5 uppercase">OUR PHILOSOPHY</p>
          <h2 className="font-display text-2xl lg:text-3xl tracking-tight mb-2.5">Gifting as a Ritual of Devotion</h2>
          <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#F9F7F2]/75 max-w-xl mx-auto">
            At Hadiya House, we believe every gift is an act of love and faith. Each hamper is thoughtfully assembled with premium,
            meaningful items — from hand-pressed Qurans to artisan attars — so your gift carries both beauty and blessing.
          </p>
        </FadeIn>
      </section>

      <FeatureBar />
      <Footer />
    </div>
  );
}
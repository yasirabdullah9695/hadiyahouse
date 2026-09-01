import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Check, Truck, ShieldCheck, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import { Image } from "@/components/ui/image";
import { productsApi } from "@/api/apiClient";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    productsApi.get(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D4C3A5] border-t-[#1A1F2C] rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F7F2]">
        <Navbar />
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-3xl text-[#1A1F2C] mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-[#4A5D4E] underline">Return to shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] font-semibold text-[#1A1F2C]/60 hover:text-[#1A1F2C] mb-8">
          <ArrowLeft size={14} strokeWidth={2} /> BACK TO SHOP
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Sticky image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F0EDE5] border border-[#D4C3A5]/20">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://media.base44.com/images/public/6a8a98432ec51b3deb4874f3/9b09ca91f_generated_75b6932a.png";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1A1F2C]/30 text-[11px] tracking-widest">HADIYA HOUSE</div>
              )}
            </div>
            {product.badge && (
              <span className="inline-block mt-4 text-[10px] tracking-[0.2em] font-semibold px-3 py-1.5 rounded-full bg-[#1A1F2C] text-[#D4C3A5]">
                {product.badge.toUpperCase()}
              </span>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-[10px] tracking-[0.25em] font-semibold text-[#4A5D4E] mb-3">{product.category.toUpperCase()}</p>
            <h1 className="font-display text-3xl lg:text-4xl text-[#1A1F2C] tracking-tight leading-tight">{product.name}</h1>
            <p className="font-heading text-2xl font-semibold text-[#1A1F2C] mt-4">₹{product.price?.toLocaleString("en-IN")}</p>

            {product.description && (
              <p className="text-[15px] text-[#1A1F2C]/65 leading-relaxed mt-5">{product.description}</p>
            )}

            {/* Inclusions */}
            {product.inclusions?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-[#D4C3A5]/30">
                <h3 className="text-[11px] tracking-[0.2em] font-semibold text-[#1A1F2C] mb-5">WHAT'S INSIDE</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.inclusions.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[14px] text-[#1A1F2C]/80">
                      <span className="w-5 h-5 rounded-full bg-[#4A5D4E]/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} strokeWidth={2.5} className="text-[#4A5D4E]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Order button */}
            <div className="mt-8">
              <button
                onClick={() => setShowOrder(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#1A1F2C] text-[#F9F7F2] text-[12px] tracking-[0.2em] font-semibold py-4 rounded-full hover:bg-[#2a3142] transition-colors"
              >
                <MessageCircle size={16} strokeWidth={1.5} /> ORDER VIA WHATSAPP
              </button>
              <p className="text-[11px] text-center text-[#1A1F2C]/45 mt-3">
                Submit your details and we'll confirm your order on WhatsApp.
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-[#D4C3A5]/30">
              {[
                { icon: ShieldCheck, label: "Premium Quality" },
                { icon: Gift, label: "Elegant Packaging" },
                { icon: Truck, label: "Safe Delivery" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center text-center gap-2">
                  <t.icon size={22} strokeWidth={1.3} className="text-[#4A5D4E]" />
                  <span className="text-[10px] tracking-[0.1em] font-semibold text-[#1A1F2C]/70">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="py-16" />
      <Footer />

      {showOrder && <OrderModal product={product} onClose={() => setShowOrder(false)} />}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Check, Truck, ShieldCheck, Gift, Star, Share2, MapPin, ThumbsUp, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderModal from "@/components/OrderModal";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/api/apiClient";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrder, setShowOrder] = useState(false);

  // Pincode Estimator State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Customer Reviews State
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Zaid Khan",
      rating: 5,
      date: "2 days ago",
      comment: "Mashallah, the gift box presentation and Quran quality surpassed my expectations! Delivery was fast.",
    },
    {
      id: 2,
      name: "Fatima Syed",
      rating: 5,
      date: "1 week ago",
      comment: "Ordered for my brother's Nikah. Everyone loved the gold foil packaging and custom calligraphy name art!",
    },
    {
      id: 3,
      name: "Tariq Malik",
      rating: 4,
      date: "2 weeks ago",
      comment: "Attar fragrance is very long lasting and authentic. High luxury packaging. Highly recommended!",
    },
  ]);

  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsApi.get(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));

    productsApi.list("-createdAt", 20)
      .then((data) => setAllProducts((data || []).filter((p) => !p.hidden)))
      .catch(() => setAllProducts([]));
  }, [id]);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setPincodeStatus({ valid: false, message: "Please enter a valid 6-digit Pincode" });
      return;
    }
    // Simulate estimated delivery based on pincode
    setPincodeStatus({
      valid: true,
      message: `Delivery available for ${cleanPin}! Estimated dispatch within 24 hours (3-4 days delivery).`,
    });
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    const added = {
      id: Date.now(),
      name: newReview.name,
      rating: Number(newReview.rating),
      date: "Just now",
      comment: newReview.comment,
    };
    setReviews([added, ...reviews]);
    setNewReview({ name: "", rating: 5, comment: "" });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const handleShareProduct = () => {
    const text = `Check out ${product?.name} at Dar-Ul-Hadaya: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: product?.name, text, url: window.location.href }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const relatedProducts = allProducts.filter(
    (p) => (p.id || p._id) !== id && (p.category === product?.category || p.type === product?.type)
  ).slice(0, 4);

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
          <Link to="/shop" className="text-[#4A5D4E] underline font-semibold">Return to shop collection</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] font-semibold text-[#1A1F2C]/60 hover:text-[#1A1F2C]">
            <ArrowLeft size={14} strokeWidth={2} /> BACK TO SHOP
          </Link>
          <button
            onClick={handleShareProduct}
            className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.15em] font-semibold text-[#4A5D4E] hover:underline"
          >
            <Share2 size={14} /> SHARE PRODUCT
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Sticky image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#F0EDE5] border border-[#D4C3A5]/30 shadow-lg relative">
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
                <div className="w-full h-full flex items-center justify-center text-[#1A1F2C]/30 text-[11px] tracking-widest">DAR-UL-HADAYA</div>
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 text-[9px] tracking-[0.18em] font-bold px-3 py-1.5 rounded-full bg-[#1A1F2C] text-[#D4C3A5] uppercase shadow-md border border-[#D4C3A5]/40">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] tracking-[0.25em] font-semibold text-[#4A5D4E] uppercase">{product.category}</p>
              {/* Rating stars summary badge */}
              <div className="flex items-center gap-1.5 bg-white border border-[#D4C3A5]/30 rounded-full px-3 py-1 text-[11px] font-bold text-[#1A1F2C]">
                <Star size={13} className="fill-[#D4C3A5] text-[#D4C3A5]" />
                <span>{avgRating}</span>
                <span className="text-[#1A1F2C]/50 font-normal">({reviews.length} reviews)</span>
              </div>
            </div>

            <h1 className="font-display text-3xl lg:text-4xl text-[#1A1F2C] tracking-tight leading-tight mt-2">{product.name}</h1>
            <p className="font-heading text-3xl font-bold text-[#1A1F2C] mt-4">₹{product.price?.toLocaleString("en-IN")}</p>

            {product.description && (
              <p className="text-[14.5px] text-[#1A1F2C]/70 leading-relaxed mt-4">{product.description}</p>
            )}

            {/* PINCODE DELIVERY ESTIMATOR WIDGET */}
            <div className="mt-6 p-4 rounded-xl bg-white border border-[#D4C3A5]/30 space-y-2.5">
              <label className="text-[11px] tracking-[0.15em] font-bold text-[#1A1F2C] uppercase flex items-center gap-1.5">
                <MapPin size={14} className="text-[#4A5D4E]" /> CHECK DELIVERY AT YOUR LOCATION
              </label>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C] w-full"
                />
                <button type="submit" className="bg-[#1A1F2C] text-[#F9F7F2] text-[10px] tracking-[0.15em] font-bold px-5 py-2 rounded-lg hover:bg-[#2a3142] flex-shrink-0">
                  CHECK
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-[12px] font-medium pt-1 ${pincodeStatus.valid ? "text-[#4A5D4E]" : "text-[#C5564A]"}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Inclusions */}
            {product.inclusions?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#D4C3A5]/30">
                <h3 className="text-[11px] tracking-[0.2em] font-semibold text-[#1A1F2C] mb-4 uppercase">WHAT'S INSIDE THE HAMPER</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.inclusions.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[13.5px] text-[#1A1F2C]/85">
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
            <div className="mt-8 space-y-3">
              <button
                onClick={() => setShowOrder(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#1A1F2C] text-[#F9F7F2] text-[12px] tracking-[0.2em] font-bold py-4 rounded-full hover:bg-[#2a3142] transition-colors shadow-lg"
              >
                <MessageCircle size={17} strokeWidth={1.5} /> ORDER VIA WHATSAPP
              </button>
              <p className="text-[11px] text-center text-[#1A1F2C]/50">
                Submit details & choose Local COD or Outstation Prepaid delivery.
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-[#D4C3A5]/30">
              {[
                { icon: ShieldCheck, label: "100% Authentic" },
                { icon: Gift, label: "Gold Packaging" },
                { icon: Truck, label: "Tracked Shipping" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center text-center gap-1.5 p-2 rounded-xl bg-white/60 border border-[#D4C3A5]/20">
                  <t.icon size={20} strokeWidth={1.4} className="text-[#4A5D4E]" />
                  <span className="text-[10px] tracking-[0.1em] font-semibold text-[#1A1F2C]/80">{t.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* CUSTOMER REVIEWS & RATINGS SECTION */}
        <section className="mt-16 pt-12 border-t border-[#D4C3A5]/30">
          <div className="max-w-4xl">
            <h2 className="font-display text-2xl text-[#1A1F2C] mb-2">Customer Reviews & Ratings</h2>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center text-[#D4C3A5]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className="fill-[#D4C3A5]" />
                ))}
              </div>
              <span className="text-[14px] font-bold text-[#1A1F2C]">{avgRating} out of 5</span>
              <span className="text-[12px] text-[#1A1F2C]/50">({reviews.length} customer reviews)</span>
            </div>

            {/* Review Cards */}
            <div className="space-y-4 mb-10">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-white border border-[#D4C3A5]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[14px] text-[#1A1F2C] font-semibold">{rev.name}</span>
                    <span className="text-[11px] text-[#1A1F2C]/40">{rev.date}</span>
                  </div>
                  <div className="flex items-center text-[#D4C3A5] gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} className={s <= rev.rating ? "fill-[#D4C3A5]" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className="text-[13px] text-[#1A1F2C]/75 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Submit Review Form */}
            <div className="p-5 rounded-2xl bg-white border border-[#D4C3A5]/40 shadow-sm space-y-4">
              <h3 className="font-display text-lg text-[#1A1F2C]">Write a Review</h3>
              {reviewSubmitted ? (
                <div className="p-3 bg-[#4A5D4E]/10 border border-[#4A5D4E]/30 rounded-xl text-[12px] font-bold text-[#4A5D4E]">
                  Thank you! Your review has been published.
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-[#1A1F2C] mb-1">YOUR NAME *</label>
                      <input
                        required
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="e.g. Abdullah Khan"
                        className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.15em] text-[#1A1F2C] mb-1">RATING *</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                        className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
                      >
                        <option value={5}>5 Stars — Excellent</option>
                        <option value={4}>4 Stars — Very Good</option>
                        <option value={3}>3 Stars — Average</option>
                        <option value={2}>2 Stars — Poor</option>
                        <option value={1}>1 Star — Terrible</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] text-[#1A1F2C] mb-1">YOUR REVIEW *</label>
                    <textarea
                      required
                      rows={2}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      className="w-full bg-[#F9F7F2] border border-[#D4C3A5]/40 rounded-lg px-3 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#1A1F2C] text-[#F9F7F2] text-[10px] tracking-[0.15em] font-bold px-6 py-2.5 rounded-full hover:bg-[#2a3142] transition-colors flex items-center gap-1.5"
                  >
                    <Send size={12} /> SUBMIT REVIEW
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#D4C3A5]/30">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] tracking-[0.25em] font-semibold text-[#4A5D4E] uppercase">RECOMMENDED FOR YOU</p>
                <h2 className="font-display text-2xl text-[#1A1F2C] mt-0.5">Similar Luxury Hampers</h2>
              </div>
              <Link to="/shop" className="text-[11px] font-bold tracking-[0.15em] text-[#1A1F2C] hover:text-[#4A5D4E]">
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id || p._id || i} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

      </div>

      <Footer />

      {showOrder && <OrderModal product={product} onClose={() => setShowOrder(false)} />}
    </div>
  );
}
import React, { useState } from "react";
import { X, MessageCircle, Loader2 } from "lucide-react";
import { ordersApi } from "@/api/apiClient";
import { openWhatsApp } from "@/lib/constants";

export default function OrderModal({ product, onClose, presetNotes = "" }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    phone: "",
    address: "",
    quantity: 1,
    notes: presetNotes,
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const total = (product?.price || 0) * (form.quantity || 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const order = {
      product_name: product.name,
      product_id: product.id,
      product_type: product.type || "Gift Box",
      product_category: product.category,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      phone: form.phone,
      address: form.address,
      quantity: form.quantity,
      notes: form.notes,
      total,
      status: "pending",
    };
    try {
      await ordersApi.create(order);
      openWhatsApp({ ...order, product_name: product.name });
      setDone(true);
    } catch (err) {
      // still open WhatsApp even if DB save fails
      openWhatsApp({ ...order, product_name: product.name });
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1F2C]/60 backdrop-blur-sm px-4">
        <div className="bg-[#F9F7F2] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#4A5D4E] flex items-center justify-center mx-auto mb-4">
            <MessageCircle size={26} className="text-[#F9F7F2]" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl text-[#1A1F2C] mb-2">Order Request Sent</h3>
          <p className="text-[13px] text-[#1A1F2C]/60 mb-6">
            Your order has been recorded and WhatsApp has opened with your details. Our team will confirm shortly.
          </p>
          <button
            onClick={onClose}
            className="bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.2em] font-semibold px-8 py-3 rounded-full hover:bg-[#2a3142] transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1F2C]/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-[#F9F7F2] rounded-2xl max-w-lg w-full my-auto shadow-2xl overflow-hidden border border-[#D4C3A5]/40">
        
        {/* Header with compact thumbnail preview */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#D4C3A5]/30 bg-[#F0EDE5]/60">
          <div className="flex items-center gap-3.5 min-w-0">
            {product?.image && (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white border border-[#D4C3A5]/40 flex-shrink-0 shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-lg text-[#1A1F2C] leading-tight truncate">{product?.name}</h3>
              <p className="text-[12px] font-bold text-[#4A5D4E] mt-0.5">
                ₹{product?.price?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#1A1F2C]/60 hover:text-[#1A1F2C] p-1 rounded-full hover:bg-[#1A1F2C]/5 flex-shrink-0" aria-label="Close">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">FULL NAME *</label>
            <input
              name="customer_name"
              required
              placeholder="Your full name"
              value={form.customer_name}
              onChange={handleChange}
              className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">PHONE (WHATSAPP) *</label>
              <input
                name="phone"
                required
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">QUANTITY</label>
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">FULL DELIVERY ADDRESS *</label>
            <textarea
              name="address"
              required
              rows={2}
              placeholder="House/Flat No, Street, City, Pincode"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C] resize-none"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">SPECIAL NOTES / GIFT MESSAGE (optional)</label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Custom calligraphy name framing instructions or gift card message..."
              className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#D4C3A5]/30">
            <span className="text-[11px] text-[#1A1F2C]/60 font-semibold uppercase tracking-wider">Total Price</span>
            <span className="font-heading text-xl font-bold text-[#4A5D4E]">₹{total.toLocaleString("en-IN")}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.2em] font-bold py-3.5 rounded-full hover:bg-[#2a3142] transition-colors disabled:opacity-60 shadow-md"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} strokeWidth={1.5} />}
            {loading ? "SENDING..." : "ORDER VIA WHATSAPP"}
          </button>
          <p className="text-[9.5px] text-center text-[#1A1F2C]/50">
            Clicking will save your order and open WhatsApp to confirm delivery details.
          </p>
        </form>
      </div>
    </div>
  );
}
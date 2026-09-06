import React, { useState } from "react";
import { X, MessageCircle, Loader2, MapPin, Truck, CreditCard } from "lucide-react";
import { ordersApi } from "@/api/apiClient";
import { openWhatsApp } from "@/lib/constants";

export default function OrderModal({ product, onClose, presetNotes = "" }) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    phone: "",
    pincode: "",
    address: "",
    delivery_type: "Within City (Cash on Delivery)", // "Within City (Cash on Delivery)" or "Outside City (Prepaid Order)"
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
      product_id: product.id || product._id,
      product_type: product.type || "Gift Box",
      product_category: product.category,
      customer_name: form.customer_name,
      customer_email: form.customer_email,
      phone: form.phone,
      pincode: form.pincode,
      address: form.address,
      delivery_type: form.delivery_type,
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
      openWhatsApp({ ...order, product_name: product.name });
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1F2C]/60 backdrop-blur-sm px-4">
        <div className="bg-[#F9F7F2] rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-[#D4C3A5]/40">
          <div className="w-14 h-14 rounded-full bg-[#4A5D4E] flex items-center justify-center mx-auto mb-4 text-[#F9F7F2]">
            <MessageCircle size={26} strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl text-[#1A1F2C] mb-2">Order Request Submitted</h3>
          <p className="text-[13px] text-[#1A1F2C]/70 mb-2">
            WhatsApp has opened with your order details.
          </p>
          <div className="bg-[#F0EDE5] p-3 rounded-xl mb-6 text-[12px] text-[#1A1F2C]/80 border border-[#D4C3A5]/30">
            <span className="font-bold text-[#4A5D4E]">Delivery Mode:</span> {form.delivery_type}
          </div>
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
      <div className="bg-[#F9F7F2] rounded-2xl max-w-lg w-full my-auto shadow-2xl overflow-hidden border border-[#D4C3A5]/40 text-[#1A1F2C]">
        
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
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
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">PINCODE / ZIPCODE *</label>
              <input
                name="pincode"
                required
                placeholder="e.g. 400001"
                value={form.pincode}
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
              placeholder="House/Flat No, Building, Street, City, State"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C] resize-none"
            />
          </div>

          {/* Delivery & Payment Mode Selection */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5 uppercase">
              DELIVERY LOCATION & PAYMENT METHOD *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  form.delivery_type === "Within City (Cash on Delivery)"
                    ? "bg-[#4A5D4E]/10 border-[#4A5D4E] shadow-sm"
                    : "bg-white border-[#D4C3A5]/40 hover:border-[#4A5D4E]/50"
                }`}
              >
                <input
                  type="radio"
                  name="delivery_type"
                  value="Within City (Cash on Delivery)"
                  checked={form.delivery_type === "Within City (Cash on Delivery)"}
                  onChange={handleChange}
                  className="mt-0.5 accent-[#4A5D4E]"
                />
                <div>
                  <p className="text-[12px] font-bold text-[#1A1F2C] flex items-center gap-1">
                    <Truck size={13} className="text-[#4A5D4E]" /> Within City
                  </p>
                  <p className="text-[10px] text-[#4A5D4E] font-semibold mt-0.5">Cash on Delivery (COD) Available</p>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  form.delivery_type === "Outside City (Prepaid Order)"
                    ? "bg-[#1A1F2C]/10 border-[#1A1F2C] shadow-sm"
                    : "bg-white border-[#D4C3A5]/40 hover:border-[#1A1F2C]/50"
                }`}
              >
                <input
                  type="radio"
                  name="delivery_type"
                  value="Outside City (Prepaid Order)"
                  checked={form.delivery_type === "Outside City (Prepaid Order)"}
                  onChange={handleChange}
                  className="mt-0.5 accent-[#1A1F2C]"
                />
                <div>
                  <p className="text-[12px] font-bold text-[#1A1F2C] flex items-center gap-1">
                    <CreditCard size={13} className="text-[#1A1F2C]" /> Outside City
                  </p>
                  <p className="text-[10px] text-[#C5564A] font-semibold mt-0.5">Prepaid Order Required (Online/UPI)</p>
                </div>
              </label>

            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C]">QUANTITY</label>
              <span className="text-[10px] text-[#1A1F2C]/50">Min: 1</span>
            </div>
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-3.5 py-2 text-[13px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1">SPECIAL NOTES / GIFT MESSAGE (optional)</label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Custom framing name, gift message..."
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
            Clicking will record your order and open WhatsApp to confirm details.
          </p>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { ordersApi } from "@/api/apiClient";
import { MessageCircle, Phone, MapPin, FileText, Mail } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-[#D4C3A5]/30 text-[#1A1F2C]",
  confirmed: "bg-[#4A5D4E]/15 text-[#4A5D4E]",
  delivered: "bg-[#1A1F2C] text-[#F9F7F2]",
  cancelled: "bg-[#C5564A]/15 text-[#C5564A]",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    ordersApi.list("-createdAt", 200)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await ordersApi.update(id, { status });
    load();
  };

  if (loading) return <div className="py-12 text-center text-[#1A1F2C]/50 text-sm">Loading orders...</div>;

  if (orders.length === 0) {
    return <p className="text-center text-[#1A1F2C]/50 text-sm py-12">No order requests yet. They'll appear here when customers order.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="bg-[#FBF9F4] rounded-xl border border-[#D4C3A5]/30 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display text-lg text-[#1A1F2C]">{o.product_name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {o.product_type && (
                  <span className="text-[9px] tracking-[0.15em] font-semibold bg-[#1A1F2C]/8 text-[#1A1F2C] px-2 py-0.5 rounded-full">{o.product_type.toUpperCase()}</span>
                )}
                {o.product_category && (
                  <span className="text-[9px] tracking-[0.15em] font-semibold bg-[#4A5D4E]/10 text-[#4A5D4E] px-2 py-0.5 rounded-full">{o.product_category.toUpperCase()}</span>
                )}
                <span className="text-[11px] text-[#1A1F2C]/50">
                  {new Date(o.created_date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-heading text-lg font-semibold text-[#1A1F2C]">₹{o.total?.toLocaleString("en-IN")}</span>
              <span className={`text-[10px] tracking-[0.15em] font-semibold px-3 py-1.5 rounded-full ${STATUS_STYLES[o.status] || STATUS_STYLES.pending}`}>
                {o.status?.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-[13px] text-[#1A1F2C]/75">
            <p className="flex items-center gap-2"><span className="font-semibold text-[#1A1F2C]">Name:</span> {o.customer_name}</p>
            {o.customer_email && <p className="flex items-center gap-2"><Mail size={13} className="text-[#4A5D4E]" /> {o.customer_email}</p>}
            <p className="flex items-center gap-2"><Phone size={13} className="text-[#4A5D4E]" /> {o.phone}</p>
            <p className="flex items-start gap-2 sm:col-span-2"><MapPin size={13} className="text-[#4A5D4E] mt-1" /> {o.address}</p>
            <p className="flex items-center gap-2"><span className="font-semibold text-[#1A1F2C]">Qty:</span> {o.quantity}</p>
            {o.notes && <p className="flex items-start gap-2 sm:col-span-2"><FileText size={13} className="text-[#4A5D4E] mt-1" /> {o.notes}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#D4C3A5]/20">
            <a
              href={`https://wa.me/${o.phone?.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] font-semibold text-[#4A5D4E] border border-[#4A5D4E]/40 px-3 py-2 rounded-full hover:bg-[#4A5D4E]/10"
            >
              <MessageCircle size={13} /> MESSAGE CUSTOMER
            </a>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] tracking-[0.1em] font-semibold text-[#1A1F2C]/50">UPDATE STATUS:</span>
              {["pending", "confirmed", "delivered", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(o.id, s)}
                  className={`text-[10px] tracking-[0.1em] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    o.status === s ? "bg-[#1A1F2C] text-[#F9F7F2] border-[#1A1F2C]" : "border-[#1A1F2C]/25 text-[#1A1F2C]/70 hover:border-[#1A1F2C]"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
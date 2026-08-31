import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lock, Package, ClipboardList, Box, Plus, LogOut, Home, Loader2 } from "lucide-react";
import { productsApi, authApi, tokenManager } from "@/api/apiClient";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/constants";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminProductTable from "@/components/admin/AdminProductTable";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminSignatureItems from "@/components/admin/AdminSignatureItems";

const SESSION_KEY = "zade_admin_session";

export default function Admin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "yes" || !!tokenManager.get()
  );
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    // Admin ke liye sab products (hidden bhi) fetch karo
    productsApi
      .list("-createdAt", 200, true)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authed) loadProducts();
  }, [authed]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const inputEmail = loginForm.email.trim().toLowerCase();
    const inputPassword = loginForm.password.trim();

    // 1. Direct admin credentials check (guarantees login works & sets valid token)
    if (inputEmail === ADMIN_EMAIL.toLowerCase() && inputPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "yes");
      tokenManager.set("admin_dev_token");
      
      // Try backend JWT auth in background (if server is online)
      try {
        const res = await authApi.login(inputEmail, inputPassword);
        if (res && res.token) tokenManager.set(res.token);
      } catch (err) {
        // Fallback admin token is already active
      }

      setAuthed(true);
      setLoginLoading(false);
      return;
    }

    // 2. Fallback backend auth check
    try {
      await authApi.login(inputEmail, inputPassword);
      sessionStorage.setItem(SESSION_KEY, "yes");
      setAuthed(true);
    } catch (err) {
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem(SESSION_KEY);
    await authApi.logout();
    setAuthed(false);
    setLoginForm({ email: "", password: "" });
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center px-4">
        <div className="bg-[#F9F7F2] rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[#1A1F2C] flex items-center justify-center mb-4 border border-[#D4C3A5]/40">
              <Lock size={22} className="text-[#D4C3A5]" strokeWidth={1.5} />
            </div>
            <span className="font-display text-xl tracking-[0.2em] text-[#1A1F2C]">Hadiya House</span>
            <p className="text-[10px] tracking-[0.3em] text-[#1A1F2C]/50 mt-1 uppercase font-semibold">Admin Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">EMAIL</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
                placeholder="Admin email"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] font-semibold text-[#1A1F2C] mb-1.5">PASSWORD</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full bg-white border border-[#D4C3A5]/40 rounded-lg px-4 py-2.5 text-[14px] text-[#1A1F2C] focus:outline-none focus:border-[#1A1F2C]"
                placeholder="Admin password"
              />
            </div>

            {loginError && (
              <p className="text-[12px] text-[#C5564A] bg-[#C5564A]/10 p-2.5 rounded-lg border border-[#C5564A]/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#1A1F2C] text-[#F9F7F2] text-[12px] tracking-[0.2em] font-semibold py-3.5 rounded-full hover:bg-[#2a3142] transition-colors disabled:opacity-60 shadow-md"
            >
              {loginLoading && <Loader2 size={14} className="animate-spin" />}
              {loginLoading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <Link to="/" className="block text-center text-[11px] text-[#1A1F2C]/50 mt-6 hover:text-[#1A1F2C] transition-colors">
            ← Back to store
          </Link>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Top bar */}
      <header className="bg-[#1A1F2C] text-[#F9F7F2] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg tracking-[0.2em] text-[#D4C3A5]">Hadiya House</span>
            <span className="text-[10px] tracking-[0.2em] text-[#F9F7F2]/50 hidden sm:inline">ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] font-semibold text-[#F9F7F2]/70 hover:text-[#D4C3A5]">
              <Home size={14} /> STORE
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] font-semibold text-[#F9F7F2]/70 hover:text-[#C5564A]">
              <LogOut size={14} /> LOGOUT
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-[#D4C3A5]/30">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 text-[11px] tracking-[0.15em] font-semibold px-5 py-3 border-b-2 transition-colors ${tab === "products" ? "border-[#1A1F2C] text-[#1A1F2C]" : "border-transparent text-[#1A1F2C]/50"}`}
          >
            <Package size={15} /> PRODUCTS CATALOGUE
          </button>
          <button
            onClick={() => setTab("signature_items")}
            className={`flex items-center gap-2 text-[11px] tracking-[0.15em] font-semibold px-5 py-3 border-b-2 transition-colors ${tab === "signature_items" ? "border-[#1A1F2C] text-[#1A1F2C]" : "border-transparent text-[#1A1F2C]/50"}`}
          >
            <Box size={15} /> SIGNATURE BOX ITEMS & PRICES
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 text-[11px] tracking-[0.15em] font-semibold px-5 py-3 border-b-2 transition-colors ${tab === "orders" ? "border-[#1A1F2C] text-[#1A1F2C]" : "border-transparent text-[#1A1F2C]/50"}`}
          >
            <ClipboardList size={15} /> ORDER REQUESTS
          </button>
        </div>

        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl text-[#1A1F2C]">Products</h1>
                <p className="text-[12px] text-[#1A1F2C]/50 mt-1">{products.length} total · manage your gift box catalogue</p>
              </div>
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="flex items-center gap-2 bg-[#1A1F2C] text-[#F9F7F2] text-[11px] tracking-[0.15em] font-semibold px-5 py-3 rounded-full hover:bg-[#2a3142]"
              >
                <Plus size={15} /> ADD PRODUCT
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-[#1A1F2C]/40" /></div>
            ) : (
              <AdminProductTable
                products={products}
                onEdit={(p) => { setEditing(p); setShowForm(true); }}
                onRefresh={loadProducts}
              />
            )}
          </div>
        )}

        {tab === "signature_items" && <AdminSignatureItems />}

        {tab === "orders" && (
          <div>
            <div className="mb-6">
              <h1 className="font-display text-2xl text-[#1A1F2C]">Order Requests</h1>
              <p className="text-[12px] text-[#1A1F2C]/50 mt-1">Customer orders submitted via WhatsApp flow. Confirm & deliver from here.</p>
            </div>
            <AdminOrders />
          </div>
        )}
      </div>

      {showForm && (
        <AdminProductForm
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadProducts(); }}
        />
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("loading"); // "loading" | "authenticated" | "unauthenticated"
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
    instructions: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    // Auth check — looks for token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // No token — redirect to /auth after short delay
      setTimeout(() => router.push("/auth"), 1500);
      setAuthStatus("unauthenticated");
    } else {
      setAuthStatus("authenticated");
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(cartData);
    }
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      setOrderError("Please fill all required fields.");
      return;
    }

    setIsLoading(true);
    setOrderError("");

    try {
      const token = localStorage.getItem("token");

      // Cart items — { name, quantity, price } format mein
      const items = cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        deliveryAddress:item.deliveryAddress,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.msg || "Something went wrong. Try again.");
        return;
      }

      // Success
      localStorage.removeItem("cart");
      setOrderPlaced(true);
    } catch (err) {
      setOrderError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };


  // ─── Loading State ───────────────────────────────────────────
  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ─── Unauthenticated State ────────────────────────────────────
  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl mx-auto mb-4">
            🔒
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Login Required</h2>
          <p className="text-sm text-zinc-500 mb-1">You need to be logged in to checkout.</p>
          <p className="text-xs text-zinc-600">Redirecting to login page...</p>
          <div className="mt-4 w-32 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full animate-[grow_1.5s_linear_forwards]" style={{ width: "0%", animation: "grow 1.5s linear forwards" }} />
          </div>
          <style>{`@keyframes grow { from { width: 0% } to { width: 100% } }`}</style>
        </div>
      </div>
    );
  }

  // ─── Order Placed State ───────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-4xl mx-auto mb-5">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-sm text-zinc-400 mb-1">
            Thank you, <span className="text-white font-medium">{form.name}</span>!
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            Your order of <span className="text-orange-500 font-semibold">₹{total}</span> is being prepared. 🍔
          </p>
          <button
            onClick={() => { localStorage.removeItem("cart"); router.push("/menu"); }}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Checkout Page ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push("/cart")}
            className="w-9 h-9 rounded-xl border border-white/10 text-zinc-400 hover:border-orange-500/40 hover:text-white transition-all flex items-center justify-center"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-semibold text-white">Checkout</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Almost there! Just fill in your details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ── Left: Delivery Form ── */}
          <div className="space-y-5">

            {/* Delivery Info */}
            <div className="bg-[#111] border border-white/7 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-400 text-xs flex items-center justify-center">1</span>
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">Full Name <span className="text-orange-500">*</span></label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">Phone Number <span className="text-orange-500">*</span></label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-zinc-500">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="rahul@gmail.com"
                    className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-zinc-500">Delivery Address <span className="text-orange-500">*</span></label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House/Flat No., Street, Area"
                    rows={2}
                    className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all resize-none"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">City <span className="text-orange-500">*</span></label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500">Pincode <span className="text-orange-500">*</span></label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {/* Landmark */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs text-zinc-500">Landmark <span className="text-zinc-600 text-xs">(optional)</span></label>
                  <input
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="Near XYZ mall"
                    className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-[#111] border border-white/7 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-400 text-xs flex items-center justify-center">2</span>
                Special Instructions
              </h2>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                placeholder="E.g. Ring the bell twice, extra chutney, no onions..."
                rows={3}
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all resize-none"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-[#111] border border-white/7 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-400 text-xs flex items-center justify-center">3</span>
                Payment Method
              </h2>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/30 bg-orange-500/5">
                <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                </div>
                <span className="text-sm text-white font-medium">Cash on Delivery</span>
                <span className="ml-auto text-lg">💵</span>
              </div>
              <p className="text-xs text-zinc-600 mt-2 pl-1">More payment options coming soon</p>
            </div>

          </div>

          {/* ── Right: Order Summary ── */}
          <div className="bg-[#111] border border-white/7 rounded-2xl p-5 sticky top-24 space-y-4">
            <h2 className="text-sm font-semibold text-white">Order Summary</h2>

            {/* Items list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                  <span className="text-white font-medium ml-2">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/7" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Delivery fee</span>
                <span className="text-white font-medium">₹{delivery}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Taxes (5%)</span>
                <span className="text-white font-medium">₹{tax}</span>
              </div>
            </div>

            <div className="border-t border-white/7" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-white">Total</span>
              <span className="text-xl font-bold text-orange-500">₹{total}</span>
            </div>

            {/* Error Message */}
            {orderError && (
              <p className="text-xs text-red-400 text-center bg-red-500/5 border border-red-500/20 rounded-lg py-2 px-3">
                {orderError}
              </p>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>Place Order · ₹{total}</>
              )}
            </button>

            <p className="text-xs text-zinc-600 text-center">
              Pay <span className="text-zinc-400">₹{total}</span> on delivery 💵
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
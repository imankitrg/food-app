"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  // same logic — total calculate
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-8">

      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-white/10 text-zinc-400 hover:border-orange-500/40 hover:text-white transition-all flex items-center justify-center">
              ←
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Your Cart</h1>
              <p className="text-xs text-zinc-500 mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => { setCart([]); localStorage.removeItem("cart"); }}
              className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-sm hover:bg-red-500/10 transition-all"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-lg font-medium text-white mb-2">Your cart is empty</h2>
            <p className="text-sm text-zinc-500 mb-6">Looks like you haven't added anything yet</p>
            <a href="/menu" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all">
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

            {/* Cart Items */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#111] border border-white/7 hover:border-orange-500/20 rounded-2xl p-4 flex items-center gap-4 transition-all"
                >
                  {/* Item Image placeholder */}
                  <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                    🍔
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-medium text-white truncate">{item.name}</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">₹ {item.price} per item</p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        const updated = cart.map((i) =>
                          i._id === item._id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
                        );
                        setCart(updated);
                        localStorage.setItem("cart", JSON.stringify(updated));
                      }}
                      className="w-7 h-7 rounded-lg border border-white/10 text-zinc-400 hover:border-orange-500/40 hover:text-white transition-all flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-white w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const updated = cart.map((i) =>
                          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                        );
                        setCart(updated);
                        localStorage.setItem("cart", JSON.stringify(updated));
                      }}
                      className="w-7 h-7 rounded-lg border border-white/10 text-zinc-400 hover:border-orange-500/40 hover:text-white transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-sm font-semibold text-white w-16 text-right flex-shrink-0">
                    ₹ {item.price * item.quantity}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => {
                      const updated = cart.filter((i) => i._id !== item._id);
                      setCart(updated);
                      localStorage.setItem("cart", JSON.stringify(updated));
                    }}
                    className="w-7 h-7 rounded-lg border border-red-500/20 text-zinc-500 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all flex items-center justify-center text-xs flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-[#111] border border-white/7 rounded-2xl p-5 sticky top-24">
              <h2 className="text-sm font-semibold text-white mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal</span>
                  <span className="text-white font-medium">₹ {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Delivery fee</span>
                  <span className="text-white font-medium">₹ {delivery}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Taxes (5%)</span>
                  <span className="text-white font-medium">₹ {tax}</span>
                </div>
              </div>

              <div className="border-t border-white/7 my-4" />

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-orange-500">₹ {total}</span>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-all"
                />
                <button className="px-3 py-2 border border-orange-500/30 text-orange-500 text-sm rounded-lg hover:bg-orange-500/10 transition-all">
                  Apply
                </button>
              </div>

              <button
  onClick={() => router.push("/checkout")}
  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl"
>
  Proceed to Checkout
</button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
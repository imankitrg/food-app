"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [prefs, setPrefs] = useState({
    orderNotif: true,
    promoOffers: true,
    smsUpdates: false,
  });

  useEffect(() => {
    // token check — same pattern as your app
    const token = localStorage.getItem("token");
    // console.log(token); to verify token presence in console
    
    if (!token) {
      router.push("/auth");
      return;
    }

    // fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data.user); 
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    // fetch order history
const fetchOrders = async () => {
  try {
    const res = await fetch("http://localhost:8080/order/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    // FIX: API array return kare ya object ke andar ho
    setOrders(Array.isArray(data) ? data : data.orders || []);
  } catch (err) {
    console.log("Orders fetch error:", err);
  }
};

    fetchProfile();
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

  // Stats from orders
// Change these two lines (line 60-61):
const totalSpent = Array.isArray(orders) ? orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0) : 0;
const delivered  = Array.isArray(orders) ? orders.filter((o) => o.status === "delivered").length : 0;

  // Initials from name
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const statusStyles = {
    delivered: "bg-green-500/12 text-green-400 border border-green-500/20",
    pending:   "bg-orange-500/12 text-orange-400 border border-orange-500/20",
    cancelled: "bg-red-500/12 text-red-400 border border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white">
              {user?.name || "Loading..."}
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">{user?.email}</p>
          </div>
          <button className="px-4 py-2 border border-white/10 hover:border-orange-500/40 hover:text-white rounded-xl text-zinc-400 text-sm transition-all">
            Edit Profile
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Orders", value: orders.length, color: "text-orange-500" },
            { label: "Total Spent",  value: `₹ ${totalSpent.toLocaleString()}`, color: "text-white" },
            { label: "Delivered",    value: delivered, color: "text-green-400" },
            { label: "Saved Items",  value: "6", color: "text-white" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-white/7 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1.5">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recent Orders */}
          <div className="bg-[#111] border border-white/7 rounded-2xl p-5">
            <h2 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
              Recent Orders
            </h2>
            <div className="space-y-1">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-none">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-base flex-shrink-0">
                    🍔
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {order.items?.map((i) => i.name).join(", ") || "Order"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-orange-500">
                      ₹ {order.totalAmount}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyles[order.status] || statusStyles.pending}`}>
                      {order.status || "pending"}
                    </span>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-2xl mb-2">🛒</p>
                  <p className="text-sm text-zinc-500">No orders yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">

            {/* Saved Addresses */}
            <div className="bg-[#111] border border-white/7 rounded-2xl p-5">
              <h2 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
                Saved Addresses
              </h2>
              <div className="space-y-2">
                {[
                  { type: "Home", icon: "🏠", text: "42, Shivaji Nagar, Pune, Maharashtra 411005" },
                  { type: "Work", icon: "💼", text: "Tech Park, Hinjewadi Phase 2, Pune 411057" },
                ].map((addr) => (
                  <div key={addr.type} className="flex gap-3 p-3 bg-[#0a0a0a] border border-white/7 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-sm flex-shrink-0">
                      {addr.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                        {addr.type}
                      </p>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                        {addr.text}
                      </p>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 border border-dashed border-white/12 hover:border-orange-500/30 hover:text-orange-500 rounded-xl text-xs text-zinc-600 transition-all">
                  + Add new address
                </button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-[#111] border border-white/7 rounded-2xl p-5">
              <h2 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
                Preferences
              </h2>
              <div className="space-y-1">
                {[
                  { key: "orderNotif", label: "Order notifications" },
                  { key: "promoOffers", label: "Promo offers" },
                  { key: "smsUpdates", label: "Delivery updates via SMS" },
                ].map((p) => (
                  <div key={p.key} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-none">
                    <span className="text-sm text-zinc-400">{p.label}</span>
                    <button
                      onClick={() => setPrefs((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
                      className={`relative w-9 h-5 rounded-full transition-all flex-shrink-0 ${
                        prefs[p.key] ? "bg-orange-500" : "bg-zinc-700"
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        prefs[p.key] ? "left-[18px]" : "left-0.5"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-4 py-2.5 border border-red-500/25 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-sm font-medium rounded-xl transition-all"
              >
                Log Out
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
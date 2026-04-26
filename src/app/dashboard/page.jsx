"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ── Icons ────────────────────────────────────────────────────────
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

// ── Status Badge ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000 / 60);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

// ════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("loading");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // ── Auth Check ───────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthStatus("unauthorized");
      setTimeout(() => router.push("/admin"), 1500);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        setAuthStatus("unauthorized");
        setTimeout(() => router.push("/admin"), 1500);
        return;
      }
      setAuthStatus("authorized");
    } catch {
      setAuthStatus("unauthorized");
      setTimeout(() => router.push("/admin"), 1500);
    }
  }, []);

  // ── Fetch Orders ─────────────────────────────────────────────
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { setOrdersError(data.msg || "Failed to fetch orders."); return; }
      setOrders(data.orders || data);
    } catch {
      setOrdersError("Network error. Could not load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus === "authorized") fetchOrders();
  }, [authStatus]);

  // ── Update Status ────────────────────────────────────────────
  const updateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.msg || "Status update failed."); return; }
      // Optimistic UI update
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert("Network error. Could not update status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/admin"); };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  // ── Screens ──────────────────────────────────────────────────
  if (authStatus === "loading") return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm">Verifying admin access...</p>
      </div>
    </div>
  );

  if (authStatus === "unauthorized") return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl mx-auto mb-4">🚫</div>
        <h2 className="text-lg font-semibold text-white mb-2">Access Denied</h2>
        <p className="text-sm text-zinc-500">Redirecting to admin login...</p>
      </div>
    </div>
  );

  // ── Main Dashboard ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* Top Bar */}
      <div className="border-b border-white/6 bg-[#0d0d0d] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-sm font-bold">F</div>
            <div>
              <h1 className="text-sm font-semibold text-white leading-none">FoodBite Admin</h1>
              <p className="text-xs text-zinc-600 mt-0.5">Orders Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-zinc-500 hidden sm:inline">Live</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 text-zinc-500 hover:text-white hover:border-white/20 text-xs transition-all"
            >
              <IconLogout /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-white">All Orders</h2>
            <p className="text-xs text-zinc-600 mt-0.5">
              {counts.pending > 0
                ? `${counts.pending} pending order${counts.pending !== 1 ? "s" : ""} need attention`
                : "All orders up to date ✓"}
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={ordersLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 text-xs transition-all disabled:opacity-40"
          >
            <span className={ordersLoading ? "animate-spin" : ""}><IconRefresh /></span>
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                filterStatus === s
                  ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                  : "border-white/7 text-zinc-500 hover:text-white hover:border-white/15"
              }`}
            >
              {s} <span className="opacity-60">({counts[s]})</span>
            </button>
          ))}
        </div>

        {/* Error */}
        {ordersError && (
          <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <span className="text-red-400">⚠️</span>
            <p className="text-sm text-red-400">{ordersError}</p>
            <button onClick={fetchOrders} className="ml-auto text-xs text-red-400 underline">Retry</button>
          </div>
        )}

        {/* Loading Skeleton */}
        {ordersLoading && orders.length === 0 && (
          <div className="space-y-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-[#111] border border-white/6 rounded-xl px-4 py-3.5 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-8 bg-white/5 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-32 h-3 bg-white/5 rounded" />
                  <div className="w-24 h-2.5 bg-white/5 rounded" />
                </div>
                <div className="w-16 h-6 bg-white/5 rounded-lg" />
                <div className="w-16 h-6 bg-white/5 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!ordersLoading && filteredOrders.length === 0 && !ordersError && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm text-zinc-500">No {filterStatus !== "all" ? filterStatus : ""} orders found</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-2">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-[#111] border border-white/6 hover:border-white/10 rounded-xl overflow-hidden transition-all">

              {/* Row */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="w-20 flex-shrink-0">
                  <p className="text-xs font-mono text-orange-400">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{timeAgo(order.createdAt)}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {order.user?.name || order.user?.email || "Customer"}
                  </p>
                  <p className="text-xs text-zinc-500 hidden sm:block">
                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <p className="text-sm font-semibold text-white flex-shrink-0 w-16 text-right">₹{order.totalAmount}</p>

                <div className="flex-shrink-0"><StatusBadge status={order.status} /></div>

                <div className={`text-zinc-600 transition-transform flex-shrink-0 ${expandedOrder === order._id ? "rotate-180" : ""}`}>
                  <IconChevron />
                </div>
              </div>

              {/* Expanded */}
              {expandedOrder === order._id && (
                <div className="border-t border-white/6 px-4 py-4 bg-[#0d0d0d]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Items */}
                    <div>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">Order Items</p>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-zinc-300">{item.name} <span className="text-zinc-600">×{item.quantity}</span></span>
                            <span className="text-white font-medium">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm pt-2 border-t border-white/6">
                          <span className="text-zinc-500">Total</span>
                          <span className="text-orange-500 font-bold">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">Update Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["pending", "confirmed", "completed", "cancelled"].map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order._id, s)}
                            disabled={order.status === s || updatingStatus === order._id}
                            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all capitalize flex items-center justify-center gap-1.5 ${
                              order.status === s
                                ? "bg-orange-500/15 border-orange-500/30 text-orange-400 cursor-default"
                                : "border-white/8 text-zinc-500 hover:border-white/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            }`}
                          >
                            {updatingStatus === order._id && order.status !== s && (
                              <div className="w-3 h-3 border border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
                            )}
                            {s}
                          </button>
                        ))}
                      </div>
                      {order.status === "completed" && <p className="text-xs text-green-500/70 mt-2">✓ Order delivered</p>}
                      {order.status === "cancelled" && <p className="text-xs text-red-400/70 mt-2">✕ Order cancelled</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
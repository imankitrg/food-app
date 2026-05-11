"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, removeCookie } from "../../lib/cookies";

// ── Icons ────────────────────────────────────────────────────────
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Status Badge ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
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

const API = process.env.NEXT_PUBLIC_API_URL;

// ── Menu Form Modal ───────────────────────────────────────────────
const EMPTY_FORM = {
  name: "", price: "", description: "", category: "main_course",
  taste: "spicy", is_drink: false, isAvailable: true, ingredients: "", image: null,
};

function MenuModal({ item, onClose, onSaved, token }) {
  const isEdit = !!item;
  const [form, setForm] = useState(
    isEdit
      ? { ...item, ingredients: (item.ingredients || []).join(", "), image: null }
      : EMPTY_FORM
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || !form.category) {
      setError("Name, price and category are required.");
      return;
    }
    if (!isEdit && !form.image) {
      setError("Please select an image.");
      return;
    }
    setLoading(true);
    setError("");
    const ingArr = form.ingredients
      ? form.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    try {
      let res;
      if (isEdit) {
        // PUT — JSON (backend uses req.body, no multer on update route)
        res = await fetch(`${API}/menu/update/${item._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name.trim(),
            price: Number(form.price),
            description: form.description || "",
            category: form.category,
            taste: form.taste,
            is_drink: form.is_drink,
            isAvailable: form.isAvailable,
            ingredients: ingArr,
          }),
        });
      } else {
        // POST — FormData (multer handles image)
        const fd = new FormData();
        fd.append("name", form.name.trim());
        fd.append("price", form.price);
        fd.append("description", form.description || "");
        fd.append("category", form.category);
        fd.append("taste", form.taste);
        fd.append("is_drink", form.is_drink);
        fd.append("isAvailable", form.isAvailable);
        ingArr.forEach((ing) => fd.append("ingredients[]", ing));
        if (form.image) fd.append("image", form.image);
        res = await fetch(`${API}/menu/create`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
      }
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Something went wrong."); return; }
      onSaved();
      onClose();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
          <h3 className="text-sm font-semibold text-white">
            {isEdit ? "Edit Menu Item" : "Add New Item"}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3.5">
          {/* Name */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Item Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Paneer Tikka"
              className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Price + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0"
                className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors appearance-none"
              >
                <option value="starter">Starter</option>
                <option value="main_course">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
              </select>
            </div>
          </div>

          {/* Taste + Is Drink row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1.5">Taste</label>
              <select
                value={form.taste}
                onChange={(e) => set("taste", e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors appearance-none"
              >
                <option value="sweet">Sweet</option>
                <option value="spicy">Spicy</option>
                <option value="sour">Sour</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer py-2.5">
                <div
                  onClick={() => set("is_drink", !form.is_drink)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${form.is_drink ? "bg-orange-500" : "bg-white/10"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.is_drink ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-zinc-400">Is Drink</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description..."
              rows={2}
              className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">
              Ingredients <span className="text-zinc-700">(comma separated)</span>
            </label>
            <input
              type="text"
              value={form.ingredients}
              onChange={(e) => set("ingredients", e.target.value)}
              placeholder="e.g. paneer, onion, spices"
              className="w-full bg-[#0d0d0d] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between bg-[#0d0d0d] border border-white/8 rounded-xl px-3 py-2.5">
            <span className="text-sm text-zinc-300">Available on menu</span>
            <div
              onClick={() => set("isAvailable", !form.isAvailable)}
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${form.isAvailable ? "bg-green-500" : "bg-white/10"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.isAvailable ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1.5">
              Image {isEdit && <span className="text-zinc-700">(leave empty to keep current)</span>}
            </label>
            <label className="flex items-center gap-3 bg-[#0d0d0d] border border-dashed border-white/15 hover:border-orange-500/40 rounded-xl px-3 py-3 cursor-pointer transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-orange-500/10 flex items-center justify-center text-zinc-500 group-hover:text-orange-400 transition-colors text-lg">
                📷
              </div>
              <div className="flex-1 min-w-0">
                {form.image ? (
                  <p className="text-sm text-orange-400 truncate">{form.image.name}</p>
                ) : (
                  <p className="text-sm text-zinc-500">Click to select image</p>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => set("image", e.target.files?.[0] || null)}
                alt="menu item image"
              />
            </label>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex gap-2.5 justify-end border-t border-white/6 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 text-xs transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ─────────────────────────────────────────
function DeleteModal({ item, onClose, onDeleted, token }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/menu/delete/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert("Delete failed."); return; }
      onDeleted(item._id);
      onClose();
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm p-5">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl mx-auto mb-3">🗑️</div>
          <h3 className="text-sm font-semibold text-white mb-1">Delete Item</h3>
          <p className="text-xs text-zinc-500">
            Are you sure you want to delete <span className="text-white">"{item.name}"</span>? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-white/8 text-zinc-400 hover:text-white text-xs transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-xs font-medium transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Menu Tab ──────────────────────────────────────────────────────
function MenuTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchMenu = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/menu/get`);
      const data = await res.json();
      if (!res.ok) { setError(data.msg || "Failed to load menu."); return; }
      setItems(data.data || data.menu || data.items || (Array.isArray(data) ? data : []));
    } catch {
      setError("Network error. Could not load menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleDeleted = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
  const handleSaved = () => fetchMenu();

  const categories = ["all", "starter", "main_course", "dessert", "drink"];
  const filtered = filterCat === "all" ? items : items.filter((i) => i.category === filterCat);

  const catCounts = categories.reduce((acc, c) => {
    acc[c] = c === "all" ? items.length : items.filter((i) => i.category === c).length;
    return acc;
  }, {});

  const tasteEmoji = { sweet: "🍬", spicy: "🌶️", sour: "🍋" };
  const catLabel = { starter: "Starter", main_course: "Main Course", dessert: "Dessert", drink: "Drink" };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-white">Menu Items</h2>
          <p className="text-xs text-zinc-600 mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""} on menu</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchMenu}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 text-xs transition-all disabled:opacity-40"
          >
            <span className={loading ? "animate-spin" : ""}><IconRefresh /></span>
            Refresh
          </button>
          <button
            onClick={() => { setEditItem(null); setShowModal(true); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-medium transition-all"
          >
            <IconPlus /> Add Item
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
              filterCat === c
                ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                : "border-white/7 text-zinc-500 hover:text-white hover:border-white/15"
            }`}
          >
            {catLabel[c] || "All"} <span className="opacity-60">({catCounts[c]})</span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
          <span className="text-red-400">⚠️</span>
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchMenu} className="ml-auto text-xs text-red-400 underline">Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && items.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111] border border-white/6 rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-white/5 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-3 bg-white/5 rounded" />
                  <div className="w-16 h-2.5 bg-white/5 rounded" />
                  <div className="w-12 h-3 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="text-sm text-zinc-500">
            No {filterCat !== "all" ? catLabel[filterCat] : ""} items found
          </p>
          <button
            onClick={() => { setEditItem(null); setShowModal(true); }}
            className="mt-3 text-xs text-orange-400 underline"
          >
            Add your first item
          </button>
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="bg-[#111] border border-white/6 hover:border-white/10 rounded-xl p-4 transition-all"
          >
            <div className="flex gap-3">
              {/* Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-sm font-semibold text-orange-400 flex-shrink-0">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-zinc-600 capitalize">{catLabel[item.category] || item.category}</span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs">{tasteEmoji[item.taste]} {item.taste}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-md border ${item.isAvailable ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"}`}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-zinc-600 mt-1 truncate">{item.description}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-white/6">
              <button
                onClick={() => { setEditItem(item); setShowModal(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 text-xs transition-all"
              >
                <IconEdit /> Edit
              </button>
              <button
                onClick={() => setDeleteItem(item)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 text-xs transition-all"
              >
                <IconTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showModal && (
        <MenuModal
          item={editItem}
          token={token}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSaved={handleSaved}
        />
      )}
      {deleteItem && (
        <DeleteModal
          item={deleteItem}
          token={token}
          onClose={() => setDeleteItem(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState("loading");
  const [activeTab, setActiveTab] = useState("orders");
  const [token, setToken] = useState("");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // ── Auth Check ───────────────────────────────────────────────
  useEffect(() => {
    const t = getCookie("token");
    if (!t) { setAuthStatus("unauthorized"); setTimeout(() => router.push("/admin"), 1500); return; }
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      if (payload.role !== "admin") { setAuthStatus("unauthorized"); setTimeout(() => router.push("/admin"), 1500); return; }
      setToken(t);
      setAuthStatus("authorized");
    } catch {
      setAuthStatus("unauthorized");
      setTimeout(() => router.push("/admin"), 1500);
    }
  }, [router]);

  // ── Fetch Orders ─────────────────────────────────────────────
  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const t = getCookie("token");
      const res = await fetch(`${API}/order/`, { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (!res.ok) { setOrdersError(data.msg || "Failed to fetch orders."); return; }
      setOrders(data.orders || data);
    } catch {
      setOrdersError("Network error. Could not load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => { if (authStatus === "authorized") fetchOrders(); }, [authStatus]);

  // ── Update Order Status ──────────────────────────────────────
  const updateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const t = getCookie("token");
      const res = await fetch(`${API}/order/status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.msg || "Status update failed."); return; }
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch {
      alert("Network error. Could not update status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleLogout = () => { removeCookie("token"); router.push("/admin"); };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // ── Screens ──────────────────────────────────────────────────
  if (authStatus === "loading")
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );

  if (authStatus === "unauthorized")
    return (
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
              <p className="text-xs text-zinc-600 mt-0.5">Management Dashboard</p>
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

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 pb-0">
          {[
            { id: "orders", label: "Orders", badge: counts.pending > 0 ? counts.pending : null },
            { id: "menu", label: "Menu", badge: null },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-orange-500 text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
              {tab.badge !== null && (
                <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div>
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
              {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
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
                {[1, 2, 3, 4].map((i) => (
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
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-[#111] border border-white/6 hover:border-white/10 rounded-xl overflow-hidden transition-all">
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <div className="w-20 flex-shrink-0">
                      <p className="text-xs font-mono text-orange-400">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{timeAgo(order.createdAt)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{order.user?.name || order.user?.email || "Customer"}</p>
                      <p className="text-xs text-zinc-500 hidden sm:block">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
                    </div>
                    <p className="text-sm font-semibold text-white flex-shrink-0 w-16 text-right">₹{order.totalAmount}</p>
                    <div className="flex-shrink-0"><StatusBadge status={order.status} /></div>
                    <div className={`text-zinc-600 transition-transform flex-shrink-0 ${expandedOrder === order._id ? "rotate-180" : ""}`}>
                      <IconChevron />
                    </div>
                  </div>

                  {expandedOrder === order._id && (
                    <div className="border-t border-white/6 px-4 py-4 bg-[#0d0d0d]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                        <div>
                          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mb-2">Update Status</p>
                          <div className="grid grid-cols-2 gap-2">
                            {["pending", "confirmed", "completed", "cancelled"].map((s) => (
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
        )}

        {/* ── MENU TAB ── */}
        {activeTab === "menu" && <MenuTab token={token} />}
      </div>
    </div>
  );
}
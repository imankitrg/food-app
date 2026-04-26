"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CATEGORIES = ["All", "Pizza", "Burger", "Drinks", "Dessert"];

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [addedIds, setAddedIds] = useState({});
  const router = useRouter();

  // same fetch logic
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/get`);
        const data = await res.json();
        setMenu(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMenu();
  }, []);

  // same addToCart logic
  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    // Visual feedback instead of alert
    setAddedIds((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item._id]: false }));
    }, 1500);
  };

  // Filter + Search
  const filtered = menu.filter((item) => {
    const matchCat =
      activeFilter === "All" ||
      item.category?.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Our Menu</h1>
        <p className="text-sm text-zinc-500">Fresh ingredients, bold flavors — order what you love</p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-5">
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-[#111] border border-white/10 focus:border-orange-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 justify-center flex-wrap mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeFilter === cat
                ? "bg-orange-500/10 border-orange-500/40 text-orange-500"
                : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="bg-[#111] border border-white/7 hover:border-orange-500/25 rounded-2xl overflow-hidden transition-all"
          >
            {/* Image area */}
            <div className="relative h-40 bg-gradient-to-br from-[#1a0e00] to-[#2a1500] flex items-center justify-center text-5xl">
              🍔
              {/* Category badge */}
              <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 border border-orange-500/30 text-orange-500 text-xs font-medium capitalize">
                {item.category}
              </span>
              {/* Availability badge */}
              <span className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                item.isAvailable
                  ? "bg-green-500/15 border-green-500/30 text-green-400"
                  : "bg-red-500/12 border-red-500/30 text-red-400"
              }`}>
                {item.isAvailable ? "Available" : "Out of Stock"}
              </span>
            </div>

            {/* Body */}
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white capitalize mb-1">
                {item.name}
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
                {item.description}
              </p>

              {/* Tags — Taste + Ingredients */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-0.5 rounded-md text-xs bg-orange-500/8 border border-orange-500/15 text-orange-400">
                  {item.taste}
                </span>
                {item.ingredients?.slice(0, 3).map((ing) => (
                  <span
                    key={ing}
                    className="px-2 py-0.5 rounded-md text-xs bg-white/5 border border-white/7 text-zinc-400"
                  >
                    {ing}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/6">
                <span className="text-lg font-bold text-orange-500">
                  ₹ {item.price}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  disabled={!item.isAvailable || addedIds[item._id]}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    !item.isAvailable
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : addedIds[item._id]
                      ? "bg-green-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {!item.isAvailable
                    ? "Unavailable"
                    : addedIds[item._id]
                    ? "Added ✓"
                    : "+ Add"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-white font-medium mb-1">No dishes found</p>
            <p className="text-xs text-zinc-500">Try a different search or category</p>
          </div>
        )}
      </div>

    </div>
  );
}
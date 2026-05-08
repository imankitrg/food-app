"use client";

import { useEffect, useState } from "react";

export default function Menu() {

  const [menu, setMenu] = useState([]);
  const [addedIds, setAddedIds] = useState({});
  const [loading, setLoading] = useState(true);

  // PAGINATION
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 5;

  // FETCH MENU
  const fetchMenu = async (currentPage = 1) => {

    try {

      const res = await fetch(
        // `${process.env.NEXT_PUBLIC_API_URL}/menu/get?page=${currentPage}&limit=${LIMIT}`
        `http://localhost:8080/menu/get?page=${currentPage}&limit=${LIMIT}`
      );

      const data = await res.json();

      // APPEND NEW DATA
      setMenu((prev) => {

        const combined = [...prev, ...data.data];

        // REMOVE DUPLICATES
        const uniqueItems = combined.filter(
          (item, index, self) =>
            index === self.findIndex((i) => i._id === item._id)
        );

        return uniqueItems;
      });

      // CHECK MORE DATA
      if (data.data.length < LIMIT) {
        setHasMore(false);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // INITIAL FETCH
  useEffect(() => {
    fetchMenu(1);
  }, []);

  // LOAD MORE
  const loadMore = async () => {

    const nextPage = page + 1;

    setPage(nextPage);

    await fetchMenu(nextPage);
  };

  // ADD TO CART
  const addToCart = (item) => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((i) => i._id === item._id);

    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setAddedIds((prev) => ({
      ...prev,
      [item._id]: true,
    }));

    setTimeout(() => {

      setAddedIds((prev) => ({
        ...prev,
        [item._id]: false,
      }));

    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Our Menu
        </h1>

        <p className="text-sm text-zinc-500">
          Fresh ingredients, bold flavors — order what you love
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">

        {loading
          ? Array.from({ length: 6 }).map((_, index) => (

              <div
                key={`skeleton-${index}`}
                className="bg-[#111] border border-white/7 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-white/5" />

                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/10 rounded-full w-3/4" />
                  <div className="h-3 bg-white/10 rounded-full w-5/6" />
                  <div className="h-3 bg-white/10 rounded-full w-1/2" />

                  <div className="flex items-center justify-between pt-3 border-t border-white/6">
                    <div className="h-6 w-16 bg-white/10 rounded-full" />
                    <div className="h-8 w-20 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            ))

          : menu.map((item) => (

              <div
                key={item._id}
                className="bg-[#111] border border-white/7 hover:border-orange-500/25 rounded-2xl overflow-hidden transition-all"
              >

                {/* IMAGE */}
                <div className="relative h-40 overflow-hidden">

                  <img
                    src={item.image || "/fallback.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                  {/* CATEGORY */}
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 border border-orange-500/30 text-orange-500 text-xs font-medium capitalize">
                    {item.category}
                  </span>

                  {/* AVAILABILITY */}
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      item.isAvailable
                        ? "bg-green-500/15 border-green-500/30 text-green-400"
                        : "bg-red-500/12 border-red-500/30 text-red-400"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Out of Stock"}
                  </span>
                </div>

                {/* BODY */}
                <div className="p-4">

                  <h2 className="text-sm font-semibold text-white capitalize mb-1">
                    {item.name}
                  </h2>

                  <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* TAGS */}
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

                  {/* FOOTER */}
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
      </div>

      {/* LOAD MORE */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-10">

          <button
            onClick={loadMore}
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all"
          >
            Load More
          </button>

        </div>
      )}
    </div>
  );
}
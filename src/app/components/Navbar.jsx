"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0a0a0a] border-b border-orange-500/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-base">
            🍔
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Food<span className="text-orange-500">Bite</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-orange-500 bg-orange-500/10 border border-orange-500/20 transition-all">
            Home
          </Link>
          <Link href="/menu" className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Menu
          </Link>
          <Link href="/cart" className="relative px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Cart
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-[#0a0a0a]" />
          </Link>
          <Link href="/profile" className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            profile
          </Link>

          <div className="w-px h-5 bg-white/10 mx-1" />

          <Link href="/auth" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all">
            Sign Up
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden border border-white/15 rounded-lg px-3 py-1.5 text-white text-base transition-all hover:bg-white/5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu — FIXED: removed hidden md:flex, now actually shows on mobile */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] border-t border-orange-500/15 px-4 py-3 flex flex-col gap-1">
          <Link href="/" className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Home
          </Link>
          <Link href="/menu" className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Menu
          </Link>
          <Link href="/cart" className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            Cart
          </Link>
          <Link href="/profile" className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
            profile
          </Link>
          <Link href="/auth" className="px-3 py-2.5 rounded-lg text-sm font-medium text-orange-500 bg-orange-500/10 border border-orange-500/20 transition-all">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
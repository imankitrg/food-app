"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed. Try again.");
        return;
      }

      // JWT token se role nikalo
      const token = data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
        setError("Access denied. You are not an admin.");
        return;
      }

      // Token save karo aur dashboard pe bhejo
      localStorage.setItem("token", token);
      router.push("/dashboard");

    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-bold mx-auto mb-3">
            F
          </div>
          <h1 className="text-xl font-bold text-white">FoodBite Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">Sign in to access the dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-[#111] border border-white/7 rounded-2xl p-6 space-y-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="admin@foodbite.com"
              className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              className="bg-[#0a0a0a] border border-white/10 focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2.5">
              <span className="text-red-400 text-lg">⚠️</span>
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : "Sign In"}
          </button>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-4">
          Admin access only · Unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function AuthPageContent() {

  
  const router = useRouter();
  const [tab, setTab] = useState("login"); // "login" | "signup"

        const searchParams = useSearchParams();

        const redirect = searchParams.get("redirect") || "/";

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Signup form state
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });

  // ── Login logic — same as original ──
  
  const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError(""); // pehle clear karo
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError( "Invalid email or password");
        return;
      }
      localStorage.setItem("token", data.token); // same as original
      router.push(redirect); // after login → redirect to /redirect which will handle further redirection logic
    } catch (error) {
      console.log("Login error:", error);
      setLoginError("Network error. Please try again."); 
    }
      };


  // ── Signup logic — same as original ──
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      const data = await res.json();
      console.log("Signup response:", data);
      setTab("login"); // after signup → switch to login tab
    } catch (error) {
      console.log("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-orange-500/8 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 bg-red-500/6 rounded-full blur-[60px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-[#111] border border-white/8 rounded-2xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-7">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-base">
            🍔
          </div>
          <span className="text-lg font-semibold text-white">
            Food<span className="text-orange-500">Bite</span>
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#0a0a0a] border border-white/7 rounded-xl p-1 mb-7">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-[#1a1a1a] text-white border border-white/10"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            <div className="text-right">
              <span className="text-xs text-zinc-500 hover:text-orange-500 cursor-pointer transition-colors">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Login
            </button>
            {loginError && (
              <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2.5">
                <span>⚠️</span>
                <p className="text-xs text-red-400">{loginError}</p>
              </div>
            )}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/7" />
              <span className="text-xs text-zinc-600">or continue with</span>
              <div className="flex-1 h-px bg-white/7" />
            </div>

            <button
              type="button"
              className="w-full py-3 border border-white/10 hover:border-white/20 rounded-xl text-sm text-zinc-400 hover:text-white transition-all"
            >
              Google Sign In
            </button>

            <p className="text-center text-xs text-zinc-600 pt-1">
              Don't have an account?{" "}
              <span
                onClick={() => setTab("signup")}
                className="text-orange-500 font-medium cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </form>
        )}

        {/* ── SIGNUP FORM ── */}
        {tab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={signupForm.name}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, name: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, email: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all"
            >
              Create Account
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/7" />
              <span className="text-xs text-zinc-600">or continue with</span>
              <div className="flex-1 h-px bg-white/7" />
            </div>

            <button
              type="button"
              className="w-full py-3 border border-white/10 hover:border-white/20 rounded-xl text-sm text-zinc-400 hover:text-white transition-all"
            >
              Google Sign Up
            </button>

            <p className="text-center text-xs text-zinc-600 pt-1">
              Already have an account?{" "}
              <span
                onClick={() => setTab("login")}
                className="text-orange-500 font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
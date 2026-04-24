import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-orange-500/20">

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo / About */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-sm">
              🍔
            </div>
            <span className="text-lg font-semibold text-white">
              Food<span className="text-orange-500">Bite</span>
            </span>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed mb-5">
            Best food delivery app. Fast, fresh and reliable service delivered
            right to your doorstep.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-xs font-medium hover:border-orange-500/40 hover:text-white transition-all">
              📱 App Store
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 text-xs font-medium hover:border-orange-500/40 hover:text-white transition-all">
              ▶ Google Play
            </button>
          </div>
        </div>

        {/* Quick Links — BUG FIXED: removed duplicate <a> tags and "Home SLow" */}
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { label: "Home", href: "/" },
              { label: "Menu", href: "/menu" },
              { label: "profile", href: "/contact" },
              { label: "Cart", href: "/cart" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-zinc-500 hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
            Services
          </h3>
          <ul className="space-y-2">
            {["Food Delivery", "Online Orders", "24/7 Support", "Live Tracking"].map(
              (s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  {s}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Social */}
        {/* <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
            Follow Us
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { name: "Instagram", icon: "📸", color: "bg-pink-500/15" },
              { name: "Twitter", color: "bg-sky-500/15", icon: "🐦" },
              { name: "Facebook", color: "bg-blue-500/15", icon: "👤" },
            ].map((s) => (
              
                key={s.name}
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/8 text-zinc-500 text-sm hover:border-orange-500/30 hover:text-white hover:bg-orange-500/5 transition-all"
              >
                <span className={`w-7 h-7 rounded-md ${s.color} flex items-center justify-center text-xs`}>
                  {s.icon}
                </span>
                {s.name}
              </a>
            ))}
          </div>
        </div> */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-600">© 2026 FoodBite. All rights reserved.</p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((l) => (
              <a key={l} href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
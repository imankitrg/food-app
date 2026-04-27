import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">

      {/* Background Video */}
      <video
        src="/141046-776768279.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-35"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/80 to-[#0a0a0a]/60 z-0" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center flex-1">

        {/* LEFT */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/8 text-orange-500 text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Now delivering in your area
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
            Delicious Food, <br />
            <span className="text-orange-500">Delivered Fast</span>
          </h1>

          <p className="text-base text-zinc-400 leading-relaxed mb-8 max-w-md">
            Order your favorite meals anytime, anywhere. Fresh ingredients,
            real flavors — at your doorstep in 30 minutes.
          </p>

          <div className="flex gap-3 flex-wrap mb-10">
            <Link href="/menu">
              <button className="px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all">
                Order Now
              </button>
            </Link>
            <Link href="/menu">
              <button className="px-7 py-3 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white text-sm font-medium rounded-xl transition-all">
                Explore Menu
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            {[
              { num: "50K+", label: "Happy customers" },
              { num: "200+", label: "Menu items" },
              { num: "30 min", label: "Avg delivery" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-8 bg-white/10" />}
                <div>
                  <p className="text-xl font-bold text-white">{s.num}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Video Player */}
        <div className="relative flex justify-center">
          {/* Glow */}
          <div className="absolute -inset-5 bg-orange-500/15 rounded-3xl blur-3xl" />

          <div className="relative w-full rounded-2xl overflow-hidden border border-orange-500/15">
            <video
              src="/food.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: '400px' }}
            />
          </div>

          {/* Floating card — Order placed */}
          <div className="absolute -bottom-4 -left-4 bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-xl">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center text-sm">✓</div>
            <div>
              <p className="text-xs font-medium text-white">Order placed!</p>
              <p className="text-xs text-zinc-500">Arriving in 28 min</p>
            </div>
          </div>

          {/* Floating card — Rating */}
          <div className="absolute -top-4 -right-4 bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-sm">★</div>
            <div>
              <p className="text-xs font-medium text-white">4.9 Rating</p>
              <p className="text-xs text-zinc-500">10K+ reviews</p>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Strip */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { icon: "⚡", title: "Lightning fast delivery", desc: "Food at your door in 30 minutes or we refund the delivery fee." },
          { icon: "🍱", title: "Fresh ingredients", desc: "Every meal made with quality ingredients sourced daily." },
          { icon: "📱", title: "Easy ordering", desc: "Order in seconds with live tracking right from your phone." },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-[#111] border border-white/7 hover:border-orange-500/25 rounded-2xl p-5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg mb-3">
              {f.icon}
            </div>
            <p className="text-sm font-medium text-white mb-1">{f.title}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
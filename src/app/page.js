import Link from 'next/link'

export default function Home() {
  const reviews = [
  { name:"Rahul K.", initials:"RK", meta:"Mumbai · 3 days ago", stars:5, color:"bg-orange-500", text:"Ordered a burger combo and it arrived in 24 minutes! Still hot and absolutely delicious.", tag:"🍔 Burger Combo" },
  { name:"Priya S.", initials:"PS", meta:"Delhi · 1 week ago", stars:5, color:"bg-blue-500", text:"Biryani was perfectly cooked and packaging was leak-proof. Live tracking made it stress-free!", tag:"🍛 Biryani Bowl" },
  { name:"Arjun M.", initials:"AM", meta:"Bangalore · 5 days ago", stars:5, color:"bg-green-500", text:"Amazing variety on the menu. Ordered sushi — fresh and well-presented. App experience is super smooth.", tag:"🍱 Sushi Platter" },
  { name:"Neha J.", initials:"NJ", meta:"Pune · 2 weeks ago", stars:4, color:"bg-purple-500", text:"Great food quality. Pizza was crispy and hot. Slightly delayed but support resolved it instantly.", tag:"🍕 Margherita Pizza" },
  { name:"Siddharth K.", initials:"SK", meta:"Hyderabad · 4 days ago", stars:5, color:"bg-pink-500", text:"Ordering every week for 2 months. Consistent quality and generous portions. Love the noodle bowl!", tag:"🍜 Noodle Bowl" },
  { name:"Divya V.", initials:"DV", meta:"Chennai · 1 week ago", stars:5, color:"bg-teal-500", text:"Super fresh salads and eco-friendly packaging. This is my go-to app for lunch at work now.", tag:"🥗 Garden Salad" },
]
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
      {/* Reviews Section */}
<div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-16">

  {/* Rating Summary */}
  <div className="bg-[#111] border border-white/7 rounded-2xl p-5 flex items-center gap-8 mb-8">
    <div className="text-center">
      <p className="text-4xl font-bold text-white">4.9</p>
      <div className="flex gap-1 justify-center my-1 text-orange-500 text-sm">★★★★★</div>
      <p className="text-xs text-zinc-500">Overall rating</p>
    </div>
    <div className="w-px h-14 bg-white/7" />
    {/* Rating bars yahan add karo */}
    <div className="flex-1 space-y-1.5">
      {[["5",82],["4",12],["3",4],["2",1.5],["1",0.5]].map(([s,w])=>(
        <div key={s} className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 w-2">{s}</span>
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{width:`${w}%`}} />
          </div>
        </div>
      ))}
    </div>
    <div className="w-px h-14 bg-white/7" />
    <p className="text-xs text-zinc-500">10,000+ verified<br/>customer reviews</p>
  </div>

  {/* Header */}
  <div className="flex items-end justify-between mb-5">
    <div>
      <h2 className="text-xl font-bold text-white">What our customers say</h2>
      <p className="text-xs text-zinc-500 mt-1">Real reviews from real foodies</p>
    </div>
    <button className="text-xs text-orange-500 border border-orange-500/25 rounded-lg px-3 py-1.5">See all →</button>
  </div>

  {/* Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {reviews.map((r) => (
      <div key={r.name} className="bg-[#111] border border-white/7 hover:border-orange-500/20 rounded-2xl p-5 transition-all">
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white ${r.color}`}>{r.initials}</div>
          <div>
            <p className="text-xs font-medium text-white">{r.name}</p>
            <p className="text-xs text-zinc-500">{r.meta}</p>
          </div>
        </div>
        <div className="text-orange-500 text-xs mb-2">{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</div>
        <p className="text-xs text-zinc-400 leading-relaxed">{r.text}</p>
        <span className="inline-block mt-3 text-xs text-orange-500 bg-orange-500/8 border border-orange-500/15 px-2.5 py-1 rounded-full">{r.tag}</span>
      </div>
    ))}
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
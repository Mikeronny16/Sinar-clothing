export default function MarqueeStrip() {
  const items = ["SINAR", "MYANMAR", "FASHION", "STYLE", "ဝတ်စုံ", "2025", "NEW COLLECTION"]
  const doubled = [...items, ...items]

  return (
    <div className="bg-pink py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-white font-serif font-bold text-sm tracking-[0.3em] uppercase px-6">
              {item}
            </span>
            <span className="text-white/60 text-xs">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

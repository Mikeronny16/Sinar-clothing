// Joy Rush-style ticker band: small-caps bold sans with little asterisk
// flowers between each phrase, on a coral bar.
function Diamond() {
  return (
    <span className="mx-6 shrink-0 text-[#C28773]" aria-hidden="true">✦</span>
  )
}

export default function MarqueeStrip() {
  const items = ["ချစ်စရာ ဝတ်စုံ", "SOFT & CHIC", "MYANMAR FASHION", "NEW SEASON 2025", "ရွေးချယ်မှုများ", "ORDER VIA DM"]
  const doubled = [...items, ...items]

  return (
    <div className="fixed top-0 inset-x-0 z-[55] bg-[#1A1611] py-1.5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-sans font-medium text-[10px] tracking-[0.32em] uppercase text-[#EFE9DD] px-1">
              {item}
            </span>
            <Diamond />
          </span>
        ))}
      </div>
    </div>
  )
}

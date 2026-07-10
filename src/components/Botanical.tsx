// Signature Sinar motif — a fine gold botanical laurel sprig drawn in line-art.
// Uses `currentColor`, so colour it with a text-* class (e.g. text-gold).

type Props = {
  className?: string
  flip?: boolean
}

export default function Botanical({ className = "", flip = false }: Props) {
  const leaves = Array.from({ length: 8 }, (_, i) => {
    const y = 30 + i * 24
    const x = 60 + Math.sin(i * 0.55) * 7 // gentle stem sway
    return { x, y }
  })

  return (
    <svg
      viewBox="0 0 120 244"
      fill="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      {/* stem */}
      <path
        d={`M60 240 ${leaves.map((l) => `L ${l.x} ${l.y}`).join(" ")}`}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.85"
      />
      {leaves.map((l, i) => (
        <g key={i} opacity={0.9 - i * 0.02}>
          <ellipse
            cx={l.x - 13}
            cy={l.y}
            rx="13"
            ry="4.6"
            stroke="currentColor"
            strokeWidth="0.9"
            transform={`rotate(-33 ${l.x - 13} ${l.y})`}
          />
          <ellipse
            cx={l.x + 13}
            cy={l.y}
            rx="13"
            ry="4.6"
            stroke="currentColor"
            strokeWidth="0.9"
            transform={`rotate(33 ${l.x + 13} ${l.y})`}
          />
        </g>
      ))}
      {/* top bud */}
      <circle cx={leaves[leaves.length - 1].x} cy="21" r="2.4" fill="currentColor" />
    </svg>
  )
}

// Slim horizontal divider: a centred diamond flanked by hairlines + tiny leaves.
export function BotanicalDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-gold ${className}`}>
      <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent to-current opacity-50" />
      <svg width="46" height="16" viewBox="0 0 46 16" fill="none" aria-hidden="true">
        <ellipse cx="15" cy="8" rx="7" ry="2.6" stroke="currentColor" strokeWidth="0.9" transform="rotate(-20 15 8)" />
        <ellipse cx="31" cy="8" rx="7" ry="2.6" stroke="currentColor" strokeWidth="0.9" transform="rotate(20 31 8)" />
        <path d="M23 3.5 L26 8 L23 12.5 L20 8 Z" fill="currentColor" />
      </svg>
      <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-transparent to-current opacity-50" />
    </div>
  )
}

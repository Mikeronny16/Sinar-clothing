interface LogoProps {
  variant?: "dark" | "light" | "color"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function Logo({ variant = "color", size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { w: 148, h: 40, iconCx: 20, textX: 88, sinarY: 0.46, clothingY: 0.82, sinarSize: 19, clothingSize: 7.5, sc: 0.78 },
    md: { w: 190, h: 52, iconCx: 26, textX: 112, sinarY: 0.46, clothingY: 0.82, sinarSize: 25, clothingSize: 9.5, sc: 1.0 },
    lg: { w: 260, h: 72, iconCx: 36, textX: 154, sinarY: 0.46, clothingY: 0.82, sinarSize: 34, clothingSize: 13, sc: 1.4 },
  }

  const s = sizes[size]

  const leaf1 = variant === "dark" ? "#A7D9B5" : "#2D6B3F"
  const leaf2 = variant === "dark" ? "#7DC49A" : "#1E4D2C"
  const vine  = variant === "dark" ? "#8BC4A0" : "#3D7A52"
  const star  = variant === "dark" ? "#FFD96A" : "#F0A500"
  const text1 = variant === "dark" ? "#F5F0E8" : "#1C2B1E"
  const text2 = variant === "dark" ? "#A7D9B5" : "#3D7A52"

  const cx = s.iconCx
  const cy = s.h / 2
  const sc = s.sc

  return (
    <svg
      width={s.w}
      height={s.h}
      viewBox={`0 0 ${s.w} ${s.h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sinar Clothing"
    >
      {/* ── Butterfly / Leaf icon ── */}
      <g transform={`translate(${cx},${cy}) scale(${sc})`}>
        {/* Left wing */}
        <path d="M-4,-15 C-14,-10 -20,0 -16,10 C-11,18 -3,18 2,12 C-1,6 -4,-2 -4,-15 Z" fill={leaf1} opacity="0.95"/>
        {/* Right wing */}
        <path d="M4,-15 C14,-10 20,0 16,10 C11,18 3,18 -2,12 C1,6 4,-2 4,-15 Z" fill={leaf1} opacity="0.88"/>
        {/* Center top leaf */}
        <path d="M0,-20 C-4,-13 -4,-6 0,0 C4,-6 4,-13 0,-20 Z" fill={leaf2} opacity="0.9"/>
        {/* Wing veins */}
        <path d="M-3,-13 C-6,-5 -7,4 -3,11" stroke={leaf2} strokeWidth="0.8" fill="none" opacity="0.5"/>
        <path d="M3,-13 C6,-5 7,4 3,11" stroke={leaf2} strokeWidth="0.8" fill="none" opacity="0.5"/>
        {/* Body */}
        <ellipse cx="0" cy="8" rx="2" ry="5" fill={leaf2} opacity="0.7"/>
        {/* Vine stem */}
        <path d="M0,13 C1,17 3,20 1,24 C-1,26 -4,24 -2,21" stroke={vine} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        {/* Vine curl */}
        <path d="M1,24 C5,26 7,22 4,20" stroke={vine} strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        {/* Star */}
        <g transform="translate(17,-20) scale(0.9)">
          <path d="M0,-5 L1.2,-1.8 L4.8,-1.8 L2,0.2 L3,3.8 L0,2 L-3,3.8 L-2,0.2 L-4.8,-1.8 L-1.2,-1.8 Z" fill={star}/>
        </g>
        {/* Accent dots */}
        <circle cx="-10" cy="13" r="1.2" fill={leaf2} opacity="0.4"/>
        <circle cx="10" cy="13" r="0.9" fill={leaf2} opacity="0.35"/>
      </g>

      {/* Divider line */}
      <line x1={s.iconCx * 2 + 6} y1={s.h * 0.2} x2={s.iconCx * 2 + 6} y2={s.h * 0.8}
        stroke={text2} strokeWidth="0.8" opacity="0.3"/>

      {/* SINAR text */}
      <text
        x={s.textX}
        y={s.h * s.sinarY}
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize={s.sinarSize}
        fontWeight="900"
        letterSpacing="0.2em"
        fill={text1}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        SINAR
      </text>

      {/* CLOTHING text */}
      <text
        x={s.textX}
        y={s.h * s.clothingY}
        fontFamily="'Inter', system-ui, sans-serif"
        fontSize={s.clothingSize}
        fontWeight="400"
        letterSpacing="0.55em"
        fill={text2}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        CLOTHING
      </text>
    </svg>
  )
}

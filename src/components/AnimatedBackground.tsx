import { useEffect, useRef } from "react"
import { useTheme } from "@/lib/theme"

export default function AnimatedBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Interactive Wind Force
    const wind = { current: 0, target: 0 }
    let lastMouseX = width / 2
    let lastTime = Date.now()

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const dt = now - lastTime
      if (dt > 10) {
        const dx = e.clientX - lastMouseX
        wind.target = Math.max(-3.5, Math.min(3.5, dx / (dt * 1.5)))
        lastMouseX = e.clientX
        lastTime = now
      }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Watercolor Splotches (Large, blurry, moving gradients)
    const splotches = [
      {
        x: width * 0.15,
        y: height * 0.25,
        vx: 0.15,
        vy: -0.1,
        r: Math.min(width * 0.55, 650),
        color: isDark ? "rgba(20, 78, 48, 0.16)" : "rgba(143, 184, 158, 0.5)", // sage green wash
      },
      {
        x: width * 0.8,
        y: height * 0.15,
        vx: -0.1,
        vy: 0.12,
        r: Math.min(width * 0.5, 600),
        color: isDark ? "rgba(194, 135, 115, 0.08)" : "rgba(245, 223, 220, 0.6)", // soft blush wash
      },
      {
        x: width * 0.35,
        y: height * 0.75,
        vx: -0.08,
        vy: -0.12,
        r: Math.min(width * 0.4, 500),
        color: isDark ? "rgba(194, 135, 115, 0.06)" : "rgba(194, 135, 115, 0.12)", // terracotta bleed
      },
      {
        x: width * 0.85,
        y: height * 0.8,
        vx: 0.12,
        vy: -0.08,
        r: Math.min(width * 0.5, 600),
        color: isDark ? "rgba(20, 78, 48, 0.14)" : "rgba(120, 166, 136, 0.4)", // emerald-tint bleed
      },
      {
        x: width * 0.45,
        y: height * 0.45,
        vx: 0.05,
        vy: -0.08,
        r: Math.min(width * 0.55, 650),
        color: isDark ? "rgba(15, 59, 36, 0.09)" : "rgba(238, 225, 210, 0.5)", // ivory wash
      },
    ]

    // Whimsical falling petals and leaves (pink and green mix)
    const pinks = isDark
      ? ["#C28773", "#A76F5B", "#905947", "#8C5645"]
      : ["#C28773", "#CBA898", "#DEC1B2", "#EAD6C8"] // terracotta → blush
    const greens = isDark
      ? ["#0F3B24", "#0A2818", "#1A4930", "#276A45"]
      : ["#9FC2AC", "#86B597", "#B4D0BE", "#7BA890"] // brand sage green leaves

    // Sparse & slow — editorial restraint, not a petal storm
    const petalCount = Math.min(30, Math.floor((width * height) / 42000))
    const petals = Array.from({ length: petalCount }, (_, i) => {
      // 2 out of 3 falling elements will be leaves
      const isLeaf = i % 3 !== 0
      const colorArr = isLeaf ? greens : pinks
      const r = Math.random() * 10 + 5

      return {
        x: Math.random() * width,
        y: Math.random() * -height,
        r,
        isLeaf,
        color: colorArr[Math.floor(Math.random() * colorArr.length)],
        speedY: Math.random() * 0.6 + 0.35, // slow, drifting fall
        swaySpeed: Math.random() * 0.010 + 0.006,
        swayAmplitude: Math.random() * 22 + 8,
        swayOffset: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.012 - 0.006,
        depth: Math.random() * 0.6 + 0.4,
        opacity: (isDark ? Math.random() * 0.4 + 0.2 : Math.random() * 0.16 + 0.08),
      }
    })

    let tick = 0
    const render = () => {
      tick++
      // Draw base pink-green blend gradient
      const baseGrad = ctx.createLinearGradient(0, 0, width, height)
      if (isDark) {
        baseGrad.addColorStop(0, "#06150C") // deep forest green
        baseGrad.addColorStop(0.5, "#0D2216")
        baseGrad.addColorStop(1, "#180C10") // deep blush/plum
      } else {
        baseGrad.addColorStop(0, "#EAF0E7") // soft sage green (brand)
        baseGrad.addColorStop(0.5, "#F1EADD") // warm sand
        baseGrad.addColorStop(1, "#F5DFDC") // soft blush (ties to logo)
      }
      ctx.fillStyle = baseGrad
      ctx.fillRect(0, 0, width, height)

      // Wind force decay
      wind.current += (wind.target - wind.current) * 0.05
      wind.target *= 0.95

      // 1. Draw Watercolor Bleeds / Splotches (Behind everything)
      splotches.forEach((s) => {
        // Move splotches slowly
        s.x += s.vx + wind.current * 0.08
        s.y += s.vy

        // Keep inside reasonable bounds
        if (s.x < -s.r) s.x = width + s.r
        if (s.x > width + s.r) s.x = -s.r
        if (s.y < -s.r) s.y = height + s.r
        if (s.y > height + s.r) s.y = -s.r

        ctx.save()
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r)
        grad.addColorStop(0, s.color)
        grad.addColorStop(0.3, s.color)
        grad.addColorStop(1, "transparent") // bleed to transparent

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // 2. Draw Falling Petal Storm (On top of wash)
      petals.forEach((p) => {
        p.y += p.speedY * p.depth
        p.x += (Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.35 + wind.current) * p.depth * 1.8
        p.angle += p.spin + wind.current * 0.008

        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color

        // Soft fuzzy shadow to look like watercolor paint thickness
        ctx.shadowColor = isDark ? "rgba(0,0,0,0.3)" : "rgba(210,139,147,0.06)"
        ctx.shadowBlur = 6
        ctx.shadowOffsetY = 3

        ctx.beginPath()

        if (p.isLeaf) {
          // Leaf shape
          ctx.moveTo(0, -p.r * 1.3)
          ctx.quadraticCurveTo(p.r * 0.75, -p.r * 0.6, p.r * 0.75, 0)
          ctx.quadraticCurveTo(p.r * 0.75, p.r * 0.6, 0, p.r * 1.3)
          ctx.quadraticCurveTo(-p.r * 0.75, p.r * 0.6, -p.r * 0.75, 0)
          ctx.quadraticCurveTo(-p.r * 0.75, -p.r * 0.6, 0, -p.r * 1.3)
          ctx.fill()

          // Leaf center vein line
          ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(92,50,122,0.12)"
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(0, -p.r * 1.3)
          ctx.lineTo(0, p.r * 1.3)
          ctx.stroke()
        } else {
          // Petal shape
          ctx.moveTo(0, -p.r)
          ctx.quadraticCurveTo(p.r * 0.85, -p.r * 0.8, p.r, 0)
          ctx.quadraticCurveTo(p.r * 0.75, p.r, 0, p.r * 1.4)
          ctx.quadraticCurveTo(-p.r * 0.75, p.r, -p.r, 0)
          ctx.quadraticCurveTo(-p.r * 0.85, -p.r * 0.8, 0, -p.r)
          ctx.fill()
        }

        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full -z-10 pointer-events-none ${className}`}
    />
  )
}

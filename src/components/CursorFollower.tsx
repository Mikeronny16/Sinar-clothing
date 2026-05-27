import { useEffect, useRef } from "react"

export default function CursorFollower() {
  const followerRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const curr = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }

      const el = e.target as HTMLElement
      const isHoverable = el.closest("a,button,[data-hover]")
      followerRef.current?.classList.toggle("expanded", !!isHoverable)
    }

    const animate = () => {
      curr.current.x += (pos.current.x - curr.current.x) * 0.15
      curr.current.y += (pos.current.y - curr.current.y) * 0.15

      if (followerRef.current) {
        followerRef.current.style.left = `${curr.current.x}px`
        followerRef.current.style.top = `${curr.current.y}px`
      }
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", onMove)
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return <div ref={followerRef} className="cursor-follower" />
}

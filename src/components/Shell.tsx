import type { ReactNode } from "react"
import MarqueeStrip from "./MarqueeStrip"
import Navbar from "./Navbar"
import Footer from "./Footer"
import BottomNav from "./BottomNav"
import AnimatedBackground from "./AnimatedBackground"
import { ScrollProgress } from "@/lib/motion"

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="min-h-screen text-text relative overflow-hidden">
      <AnimatedBackground />
      <ScrollProgress />
      <MarqueeStrip />
      <Navbar />
      <main className="pt-28 relative z-10">{children}</main>
      <Footer />
      <div className="h-24" />
      <BottomNav />
    </div>
  )
}

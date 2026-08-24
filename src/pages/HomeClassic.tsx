import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import MarqueeStrip from "@/components/MarqueeStrip"
import Products from "@/components/Products"
import StatementBand from "@/components/StatementBand"
import Features from "@/components/Features"
import CustomerReviews from "@/components/CustomerReviews"
import About from "@/components/About"
import Footer from "@/components/Footer"
import BottomNav from "@/components/BottomNav"
import AnimatedBackground from "@/components/AnimatedBackground"
import { ScrollProgress } from "@/lib/motion"
import { useTheme } from "@/lib/theme"

export default function HomeClassic() {
  const { isDark } = useTheme()

  return (
    <div id="top" className="min-h-screen text-text transition-colors duration-300 relative overflow-hidden">
      <AnimatedBackground />
      <ScrollProgress />
      <MarqueeStrip />
      <Navbar />
      <Hero />
      <Products />
      <StatementBand />
      <Features />
      <CustomerReviews />
      <About />
      <Footer />
      {/* space so the floating bottom nav never covers footer content */}
      <div className="h-24" />
      <BottomNav />
    </div>
  )
}

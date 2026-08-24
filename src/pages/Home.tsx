import { useEffect } from "react"
import Footer from "@/components/Footer"
import HeldNav from "@/components/film/HeldNav"
import Chrome from "@/components/film/Chrome"
import Act from "@/components/film/Act"
import Closer from "@/components/film/Closer"
import { ACTS } from "@/components/film/acts"
import { holdOverlays } from "@/lib/overlays"

/**
 * The front door is a film, not a page. Seven sticky acts scroll past a fixed
 * chrome that inverts with each scene, then the season and the way in.
 * The old shop-front homepage is kept at /classic.
 */
export default function Home() {
  useEffect(() => () => holdOverlays(false), [])

  return (
    <div id="top" className="film relative">
      <Chrome />

      {ACTS.map((act) => (
        <Act key={act.n} act={act} total={ACTS.length} />
      ))}

      <Closer />

      <Footer />
      <div className="h-24" />
      <HeldNav />
    </div>
  )
}

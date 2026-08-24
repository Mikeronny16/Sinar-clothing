import BottomNav from "@/components/BottomNav"
import { useOverlaysHeld } from "@/lib/overlays"

/** The bottom nav stays out of the frame while the film runs, like everything else. */
export default function HeldNav() {
  if (useOverlaysHeld()) return null
  return <BottomNav />
}

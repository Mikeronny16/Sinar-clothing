import InstallButton from "./InstallButton"
import SocialProofPopup from "./SocialProofPopup"
import AiStylistBot from "./AiStylistBot"
import { useOverlaysHeld } from "@/lib/overlays"

/**
 * Everything that floats over the page — silenced while the film is running and
 * inside the app screens. The stylist stays mounted (minus its launcher) so the
 * app header can still open it.
 */
export default function FloatingChrome() {
  const held = useOverlaysHeld()
  return (
    <>
      {!held && <InstallButton />}
      {!held && <SocialProofPopup />}
      <AiStylistBot hideFab={held} />
    </>
  )
}

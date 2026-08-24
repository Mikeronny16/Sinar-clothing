import InstallButton from "./InstallButton"
import SocialProofPopup from "./SocialProofPopup"
import AiStylistBot from "./AiStylistBot"
import { useOverlaysHeld } from "@/lib/overlays"

/** Everything that floats over the page — silenced while the film is running. */
export default function FloatingChrome() {
  if (useOverlaysHeld()) return null
  return (
    <>
      <InstallButton />
      <SocialProofPopup />
      <AiStylistBot />
    </>
  )
}

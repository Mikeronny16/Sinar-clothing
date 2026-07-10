import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { toast } from "sonner"

type BIPEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallButton() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true
    if (standalone || sessionStorage.getItem("sinar-install-dismissed")) {
      setHidden(true)
      return
    }

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
    }
    const onInstalled = () => {
      setHidden(true)
      toast.success("Sinar app ကို install လုပ်ပြီးပါပြီ 🎉")
    }
    window.addEventListener("beforeinstallprompt", onPrompt)
    window.addEventListener("appinstalled", onInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt)
      window.removeEventListener("appinstalled", onInstalled)
    }
  }, [])

  if (hidden) return null

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice
      setDeferred(null)
      setHidden(true)
      return
    }
    if (isIOS) {
      toast("iPhone: Share ⬆️ → ‘Add to Home Screen’ ကို နှိပ်ပါ", { duration: 6000 })
    } else {
      toast("Chrome menu ⋮ → ‘Install app / ဒီ site ကို install’ ကို ရွေးပါ", { duration: 6000 })
    }
  }

  return (
    <div className="fixed left-4 bottom-24 sm:bottom-6 z-[60] flex items-center gap-2">
      <button
        onClick={handleClick}
        className="group flex items-center gap-2.5 rounded-full bg-[#1A1611] pl-2 pr-4 py-2 text-[#F3EEE4] shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5"
      >
        <img src="/icon-192.png" alt="" className="h-7 w-7 rounded-full object-cover" />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[11px] font-medium tracking-wide">Install App</span>
          <span className="font-mm text-[9px] text-[#C28773]">Sinar ကို ဖုန်းထဲ ထည့်ရန်</span>
        </span>
      </button>
      <button
        onClick={() => { setHidden(true); sessionStorage.setItem("sinar-install-dismissed", "1") }}
        aria-label="Dismiss"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1A1611]/70 text-[#F3EEE4]/70 hover:text-[#F3EEE4] transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

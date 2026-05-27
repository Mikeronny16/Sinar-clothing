import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SITE } from "@/config"
import { Loader2, Lock } from "lucide-react"
import { toast } from "sonner"

const LOCAL_ADMIN_KEY = "sinar_admin_auth"
const LOCAL_ADMIN_PWD = "sinar2025"

export default function Auth() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(LOCAL_ADMIN_KEY) === "true") {
      navigate("/admin", { replace: true })
    }
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (password !== LOCAL_ADMIN_PWD) throw new Error("Password မှားနေသည်")
      localStorage.setItem(LOCAL_ADMIN_KEY, "true")
      navigate("/admin", { replace: true })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "ဝင်ရောက်မရပါ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-4 relative">
      <div className="absolute top-8 left-8 w-10 h-10 border-l border-t border-pink/20" />
      <div className="absolute top-8 right-8 w-10 h-10 border-r border-t border-pink/20" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-l border-b border-pink/20" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-r border-b border-pink/20" />

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="font-serif text-5xl font-black tracking-[0.2em] text-cream hover:text-pink transition-colors">
            {SITE.name.toUpperCase()}
          </a>
          <p className="text-muted text-sm mt-2 font-mm">Admin Panel ဝင်ရောက်ရန်</p>
        </div>

        <div className="bg-forest-mid rounded-2xl border border-hairline p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-pink/10 border border-pink/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-pink" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-medium text-muted uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-forest border border-hairline focus:border-pink rounded-xl px-4 py-3 text-sm text-cream placeholder-muted focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink text-white py-3 rounded-xl text-sm font-semibold hover:shadow-pink transition-shadow disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span className="font-mm">ဝင်ရောက်မည်</span>
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-muted text-sm hover:text-cream transition-colors font-mm">
            ← Website ပြန်သွားရန်
          </a>
        </div>
      </div>
    </div>
  )
}

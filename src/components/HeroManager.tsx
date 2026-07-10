import { useRef, useState } from "react"
import { Trash2, ArrowUp, ArrowDown, RotateCcw, ImageIcon, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { getHeroSlides, saveHeroSlides, resetHeroSlides } from "@/lib/hero"

async function uploadOne(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
  const path = `hero-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`
  const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from("product-images").getPublicUrl(path)
  return data.publicUrl
}

export default function HeroManager() {
  const [slides, setSlides] = useState<string[]>(getHeroSlides)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const commit = (next: string[]) => { setSlides(next); saveHeroSlides(next) }
  const remove = (i: number) => commit(slides.filter((_, idx) => idx !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= slides.length) return
    const next = [...slides]
    ;[next[i], next[j]] = [next[j], next[i]]
    commit(next)
  }

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const f of files) {
        if (!f.type.startsWith("image/")) continue
        urls.push(await uploadOne(f))
      }
      if (urls.length) {
        commit([...slides, ...urls])
        toast.success(`${urls.length} ပုံ upload ပြီး!`)
      }
    } catch (err) {
      toast.error("Upload မအောင်မြင်ပါ — " + ((err as Error)?.message || "try again"))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-[#F5F0E8]">Landing Photos</h1>
          <p className="text-[#7A8F7D] text-sm mt-0.5">ပင်မစာမျက်နှာ ဓာတ်ပုံများ · {slides.length} ခု</p>
        </div>
        <button
          onClick={() => { resetHeroSlides(); setSlides(getHeroSlides()); toast.success("Default ပြန်သတ်မှတ်ပြီး") }}
          className="flex items-center gap-2 border border-[#1C3020] text-[#7A8F7D] hover:text-[#F5F0E8] px-4 py-2.5 rounded-full text-xs font-semibold hover:border-[#C08A78]/40 transition-colors self-start"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Direct upload dropzone */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full rounded-2xl border-2 border-dashed border-[#1C3020] hover:border-[#C08A78]/50 bg-[#0F2415] py-10 flex flex-col items-center gap-2 transition-colors disabled:opacity-60"
      >
        {uploading ? <Loader2 className="w-7 h-7 text-[#C08A78] animate-spin" /> : <Upload className="w-7 h-7 text-[#C08A78]" />}
        <span className="text-[#F5F0E8] font-mm text-sm">{uploading ? "Upload တင်နေသည်..." : "ဓာတ်ပုံ တင်ရန် နှိပ်ပါ"}</span>
        <span className="text-[11px] text-[#4A6350]">ဖုန်း/ကွန်ပျူတာထဲက ပုံရွေးပါ · JPG / PNG · တစ်ခုထက်ပို ရွေးလို့ရ</span>
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />

      {/* Slides */}
      {slides.length === 0 ? (
        <div className="text-center py-16 bg-[#0F2415] rounded-2xl border border-[#1C3020]">
          <ImageIcon className="w-10 h-10 text-[#1C3020] mx-auto mb-3" />
          <p className="text-[#7A8F7D] font-mm text-sm">ဓာတ်ပုံ မရှိသေးပါ — အပေါ်မှာ တင်ပါ</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((url, i) => (
            <div key={i} className="group relative rounded-xl overflow-hidden border border-[#1C3020] bg-[#0A1A0F] aspect-[3/4]">
              <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2" }} />
              <span className="absolute left-2 top-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">{String(i + 1).padStart(2, "0")}</span>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-lg bg-black/50 text-white/80 hover:text-white disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="p-1.5 rounded-lg bg-black/50 text-white/80 hover:text-white disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => remove(i)} className="p-1.5 rounded-lg bg-black/50 text-white/80 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
